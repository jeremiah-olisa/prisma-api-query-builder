import * as _ from 'lodash';
import * as qs from 'qs';
import { parseObject } from './query-string-parser';
import { defaultOptions, defaultPrismaStringFilter, isObjectEmpty, skip, defaultQueryFields, take } from './query-builder.constant';
import type { IAnyObject, IBuilderObj, IModelEntity, IPaginated, IQueryFields, QueryBuilder, PrismaValidStringFilter, PrismaWhereInput } from '../types';



class ApiQueryBuilder<WhereInput = PrismaWhereInput, TModelEntity extends IModelEntity = IModelEntity, PrismaModelDelegate extends any = any> {
  protected query: IQueryFields;
  protected modelEntity: PrismaModelDelegate;
  protected entity: IModelEntity;
  protected validStringFilter: PrismaValidStringFilter[];
  // TODO: change from prismaclient to prismaservice
  protected builder: QueryBuilder = {
    filter: {},
    paginated: { currentPage: 1, pages: 1 },
    select: {},
    sort: {},
    paginate: { skip, take }
  };
  protected builderObj: IBuilderObj = {
    skip,
    take,
    where: {},
    select: {},
    orderBy: {}
  };

  constructor(modelEntity: PrismaModelDelegate, entity: TModelEntity, validStringFilter: PrismaValidStringFilter[] = defaultPrismaStringFilter, query?: IQueryFields) {
    this.modelEntity = modelEntity;
    this.query = query ?? defaultQueryFields;
    this.entity = entity;
    this.validStringFilter = validStringFilter;
    // console.log({ querySelect: query.select, defaultQueryFieldsSelect: defaultQueryFields.select, builder: this.builder })
  }

  filter() {
    const filterObj: object = parseObject(qs.parse(this?.query?.filter ?? '', { comma: true }));

    console.log({ filterObj })
    const validFilterObj = this.filterRecursive(filterObj);
    // console.log({ filterObj, validFilterObj })
    this.builder.filter = validFilterObj;
    return this;
  }

  sort() {
    const sort = _.intersectionWith(
      (this?.query?.sort ?? defaultQueryFields.sort).split(','),
      [
        ...this.entity.sortableColumns,
        ...this.entity.sortableColumns.map((col) => `-${col}`),
      ],
    );
    // console.log(sort)
    this.builder.sort = sort?.map((s: string) => {
      const key = s?.startsWith('-') ? s?.slice(1, s?.length) : s;
      return { [key]: s?.startsWith('-') ? 'desc' : 'asc' };
    });

    return this;
  }

  /**
   * It takes a string of comma separated values, and converts it to an object with the values as keys
   * and true as the value
   * @returns The builder object.
   */
  select() {
    const selectObj = qs.parse(`query=${this?.query?.select || 'true'}`, {
      comma: true,
    }) as any;

    this.builder.select = this.arrayToBoolObject(
      this.entity.selectableColumns,
      this.toArray(selectObj?.query),
    );
    // console.log(this.builder.select)
    // console.log({
    //   selectableColumns: this.entity.selectableColumns,
    //   selectObjQuery: this.toArray(selectObj?.query),
    // })
    return this;
  }

  /**
   * It takes a query string like this:
   * ?include=user.name,user.email,user.address.city,user.address.state
   * and turns it into this:
   * {
   *   user: {
   *     select: {
   *       name: true,
   *       email: true,
   *       address: {
   *         select: {
   *           city: true,
   *           state: true
   *         }
   *       }
   *     }
   *   }
   * }</code>
   *
   *
   *
   * I'm trying to write a test for this function, but I'm having trouble figuring out how to mock the
   * <code>this.builder</code> object.
   * Here's what I have so far:
   *
   *
   * <code>import { QueryBuilder } from '@mikro-orm/knex';
   * import { populate } from '../../src/utils/
   * @returns The builder object with the select property populated.
   */
  populate() {
    const includeObj = qs.parse(this?.query?.include ?? '', { comma: true }) as any;

    if (isObjectEmpty(includeObj)) return this;

    this.entity.allowedRelationShips?.forEach((col) => {
      const selectables = this.entity.selectableRelationShips[col];
      const includeQueryParam = this.toArray(includeObj[col] ?? []);
      const filteredIncludeObj = this.arrayToBoolObject(
        selectables,
        includeQueryParam,
      );
      // const hasKey = this.builder?.select?.hasOwnProperty(col);

      if (!this.builder.select)
        this.builder.select = {};

      this.builder.select[col] = {
        select:
          includeQueryParam[0] == 'true'
            ? this.arrayToBoolObject(selectables, selectables)
            : filteredIncludeObj ?? undefined,
      }
    });
    return this;
  }

  /**
   * If the query object has a page property, then multiply it by 1, otherwise set it to 1. If the
   * query object has a limit property, then multiply it by 1, otherwise set it to 50. Then, set the
   * skip property to the page minus 1 multiplied by the limit. Finally, set the paginate property of
   * the builder object to an object with the skip and take properties.
   * @returns The builder object.
   */
  paginate() {
    const page = (this.query?.page ?? defaultOptions.currentPage) * 1 || 1;
    const limit = (this.query?.limit ?? defaultOptions.perPage) * 1 || 50;
    const skip = (page - 1) * limit;
    this.builder.paginate = { skip, take: limit };

    return this;
  }

  /**
   * It takes the filter, paginate, select, and sort properties of the builder object and assigns them
   * to the builderObj object
   * @returns The builder object
   */
  build() {
    const { filter, paginate, select, sort } = this.builder;
    this.builderObj = {
      where: filter,
      select,
      orderBy: sort,
      ...paginate,
    };

    // console.log({ builderObj: this.builderObj })
    return this;
  }

  /**
   * This function sorts, filters, selects, populates, and paginates the data, and then returns the
   * data.
   * @returns The query object.
   */
  all() {
    this.sort();
    this.filter();
    this.select();
    this.populate();
    this.paginate();
    return this;
  }

  /**
   * "This function returns an object with two properties: data and paginated. The data property is an
   * array of objects and the paginated property is an object with three properties: currentPage,
   * perPage, and totalPages."
   * </code>
   * @returns The return type is an object with two properties: data and paginated.
   */
  async many() {
    // DONE: replace "model as any" with "model"

    const data: Partial<TModelEntity>[] = await (this.modelEntity as any).findMany(
      this.builderObj,
    );

    const totalRecords: number = await (this.modelEntity as any).count({
      where: this.builderObj.where,
    });

    const paginated: IPaginated = {
      currentPage: this.query?.page ?? defaultQueryFields.page * 1,
      perPage: (this.query.limit ?? defaultQueryFields.limit) * 1 || data?.length,
      totalPages: Math.ceil(totalRecords / this.builderObj.take),
      totalRecords,
    };

    if (
      paginated.currentPage > 1 &&
      paginated.currentPage > paginated.totalPages
    )
      return 'NotFoundException';

    // console.log(this.builderObj)
    return { data, paginated };
  }

  async findMany(filter: WhereInput) {
    // DONE: replace "model as any" with "model"
    if (!(filter as any)?.where)
      return 'Invalid Filter Parameter';


    const data: Partial<TModelEntity>[] = await (this.modelEntity as any).findMany(
      filter,
    );

    const totalRecords: number = await (this.modelEntity as any).count({
      where: (filter as any)?.where,
    });

    const paginated: IPaginated = {
      currentPage: this.query?.page ?? defaultQueryFields.page * 1,
      perPage: (this.query.limit ?? defaultQueryFields.limit) * 1 || data?.length,
      totalPages: Math.ceil(totalRecords / this.builderObj.take),
      totalRecords,
    };

    if (
      paginated.currentPage > 1 &&
      paginated.currentPage > paginated.totalPages
    )
      return 'NotFoundException';

    // console.log(this.builderObj)
    return { data, paginated };
  }

  /**
   * The function takes a filter object and returns a promise that resolves to an object.
   * @param filter - Prisma.SelectSubset<any, any>
   * @returns The return type is "object"
   */
  async one(filter: WhereInput) {
    if (!(filter as any)?.where)
      return 'Invalid Filter Parameter';

    // DONE: replace "model as any" with "model"
    const { where, skip, take, ...obj } = this.builderObj;
    // console.log({
    //   where: { ...filter?.where as object, ...where },
    //   ...obj,
    // })

    console.log({ filter });
    return (this.modelEntity as any).findFirst({
      where: { ...((filter as any)?.where as object), ...where },
      ...obj,
    }) as Partial<TModelEntity>;
  }

  /**
   * If the value is undefined or null, return an empty array. If the value is an array, return the
   * array with all undefined values removed. Otherwise, return an array with the value as the only
   * element.
   * @param val - The value to be converted to an array.
   */
  private toArray(val: any | any[]) {
    if (val == undefined || val == null) return [];

    if (Array.isArray(val)) return val.filter((col) => col != undefined);

    return [val];
  }

  /**
   * It takes an array of strings and returns an object with the strings as keys and the values as
   * true.
   * @param {string[]} selectables - string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
   * 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
   * @param {string[]} array - ["true", "false", "false", "false", "false", "false", "false", "false",
   * "false", "false", "false", "false", "false", "false", "false", "false", "false", "false", "false",
   * "false",
   * @returns An object with the keys of the array and the values of true.
   */
  private arrayToBoolObject(selectables: string[], array: string[]): IAnyObject<boolean> {
    if (array[0] == 'true')
      return this.arrayToBoolObject(selectables, selectables);

    array = _.intersectionWith(array, selectables);
    // array = array.filter(col => selectables.includes(col))

    const obj: IAnyObject<boolean> = {};
    array?.forEach((element) => {
      obj[element] = true;
    });

    // console.log("obj: ", obj)
    return isObjectEmpty(obj) ? {} : obj;
  }

  /**
   * It takes a filter object, picks only the keys that are filterable, and then checks if the value is
   * a string or an array. If it's not, it picks only the valid string filters, and then checks if the
   * object is empty. If it's not, it returns the trimmed filter value. If it is, it returns undefined.
   *
   *
   * If the value is a string or an array, it checks if the value is an "in" or "notIn" filter, and if
   * it is, it splits the string and returns an array.
   *
   * I'm not sure if this is the best way to do this, but it works.
   * @param {object} filterObj - object = {
   */
  private filterRecursive(filterObj: object) {
    const validFilterObj: IAnyObject = _.pick(filterObj, [
      ...this.entity.filterableColumns,
      'AND',
      'NOT',
      'OR',
      ...this.entity.filterableReltionship,
    ]);
    // console.log('1', { validFilterObj })

    for (const key in validFilterObj) {
      const filterValue: string | object = validFilterObj[key];

      if (typeof filterValue != 'string' && !Array.isArray(filterValue)) {
        const trimmedFilterValue = _.pick(filterValue, [
          ...this.validStringFilter,
          ...this.entity.filterableReltionshipColumns,
        ]);

        // console.log('0', { filterValue, trimmedFilterValue, key })
        validFilterObj[key] = isObjectEmpty(trimmedFilterValue)
          ? undefined
          : trimmedFilterValue;

        if (validFilterObj[key]?.in)
          validFilterObj[key].in = this.toArray(
            validFilterObj[key]?.in.split(','),
          );

        if (validFilterObj[key]?.notIn)
          validFilterObj[key].notIn = this.toArray(
            validFilterObj[key]?.notIn.split(','),
          );
      }
    }

    // console.log('2', { validFilterObj })

    return validFilterObj;
  }
}


export default ApiQueryBuilder;