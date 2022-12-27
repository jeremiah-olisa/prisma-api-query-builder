import * as _ from 'lodash';
import * as qs from 'qs';
import { parseObject } from './query-string-parser';
import { defaultOptions, defaultPrismaStringFilter, isObjectEmpty, skip, defaultQueryFields, take } from './query-builder.constant';
import type { IAnyObject, IBuilderObj, IModelEntity, IPaginated, IQueryFields, QueryBuilder, PrismaValidStringFilter, PrismaWhereInput } from '../types';

/* It takes a model entity, a query object and a valid string filter array and returns a valid Prisma
query object */
class ApiQueryBuilder<TModelEntity extends IModelEntity = IModelEntity, WhereInput = PrismaWhereInput, PrismaModelDelegate extends any = any> {
  /* Defining the class properties. */
  protected query: IQueryFields;
  protected modelEntity: PrismaModelDelegate;
  protected entity: IModelEntity;
  protected validStringFilter: PrismaValidStringFilter[];

  /* Defining the default values for the query builder. */
  protected builder: QueryBuilder = {
    filter: {},
    paginated: { currentPage: 1, pages: 1 },
    select: {},
    sort: {},
    paginate: { skip, take }
  };
  /* Defining the default values for the query builder object. */
  protected builderObj: IBuilderObj = {
    skip,
    take,
    where: {},
    select: {},
    orderBy: {}
  };

  /**
   * The constructor takes in a modelEntity, entity, query, and validStringFilter
   * @param {PrismaModelDelegate} modelEntity - This is the prisma entity e.g this.prisma.shoppingItem
   * @param {TModelEntity} entity - This is the entity that you want to query. it also contains all the settings for filtering and selecting of data
   * @param {IQueryFields} [query] - This is the query string fields from the api.
   * @param {PrismaValidStringFilter[]} validStringFilter - This is an array of
   * PrismaValidStringFilter. This is used to validate the string filter.
   */
  constructor(modelEntity: PrismaModelDelegate, entity: TModelEntity, query?: IQueryFields, validStringFilter: PrismaValidStringFilter[] = defaultPrismaStringFilter) {
    this.modelEntity = modelEntity;
    this.query = query ?? defaultQueryFields;
    this.entity = entity;
    this.validStringFilter = validStringFilter;
  }

  /**
   * It takes a query string, parses it into an object, and then recursively filters out any invalid
   * keys
   * @returns The builder object with the filter property set to the validFilterObj.
   */
  filter() {
    const filterObj: object = parseObject(qs.parse(this?.query?.filter ?? '', { comma: true }));
    const validFilterObj = this.filterRecursive(filterObj);
    this.builder.filter = validFilterObj;
    return this;
  }

  /**
   * It takes the sort query parameter, splits it into an array, and then filters it to only include
   * the sortable columns
   * @returns The builder object
   */
  sort() {
    const sort = _.intersectionWith(
      (this?.query?.sort ?? defaultQueryFields.sort).split(','),
      [
        ...this.entity.sortableColumns,
        ...this.entity.sortableColumns.map((col) => `-${col}`),
      ],
    );
    this.builder.sort = sort?.map((s: string) => {
      const key = s?.startsWith('-') ? s?.slice(1, s?.length) : s;
      return { [key]: s?.startsWith('-') ? 'desc' : 'asc' };
    });
    return this;
  }

  /**
   * It takes the `select` query parameter, parses it into an array, and then converts that array into
   * an object with the keys being the column names and the values being `true` or `false` depending on
   * whether the column was selected or not
   * @returns The builder object
   */
  select() {
    const selectObj = qs.parse(`query=${this?.query?.select || 'true'}`, {
      comma: true,
    }) as any;

    this.builder.select = this.arrayToBoolObject(
      this.entity.selectableColumns,
      this.toArray(selectObj?.query),
    );

    return this;
  }

  /**
   * If the user has passed in a query parameter called `include` then we will add the `select`
   * property to the knex query builder
   * @returns The builder object with the select property set to the selectables object.
   */
  populate() {
    const includeObj = qs.parse(this?.query?.include ?? '', { comma: true }) as any;

    if (isObjectEmpty(includeObj)) return this;

    /* Checking if the user has passed in a query parameter called `include` then we will add the
     * `select`
    ** property to the knex query builder */
    this.entity.allowedRelationShips?.forEach((col) => {
      const selectables = this.entity.selectableRelationShips[col];
      const includeQueryParam = this.toArray(includeObj[col] ?? []);
      /* Filtering the include query parameter to only include the selectable columns. */
      const filteredIncludeObj = this.arrayToBoolObject(selectables, includeQueryParam);

      if (!this.builder.select) this.builder.select = {};

      // if true select only the selectables else select the valid relational columns
      const select = includeQueryParam[0] == 'true' ?
        this.arrayToBoolObject(selectables, selectables)
        : isObjectEmpty(filteredIncludeObj) ? undefined : filteredIncludeObj

      this.builder.select[col] = { select }
    });

    return this;
  }

  /**
   * It takes the page and limit from the query string, and then uses them to calculate the skip and
   * take values for the pagination
   * @returns The builder object with the paginate property set to an object with skip and take
   * properties.
   */
  paginate() {
    const page = (this.query?.page ?? defaultOptions.currentPage) * 1 || 1;
    const limit = (this.query?.limit ?? defaultOptions.perPage) * 1 || 50;
    const skip = (page - 1) * limit;
    this.builder.paginate = { skip, take: limit };
    return this;
  }

  /**
   * It takes the filter, paginate, select, and sort properties from the builder object and assigns
   * them to the builderObj property
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

    return this;
  }

  /**
   * This function sorts, filters, selects, populates, and paginates the query, and then returns the
   * query.
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
   * It returns a paginated object with the data and the paginated object
   * @returns An object with two properties: data and paginated.
   */
  async many() {
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

    if (paginated.currentPage > 1 && paginated.currentPage > paginated.totalPages) return 'NotFoundException';

    return { data, paginated };
  }

  /**
   * It takes a filter object as a parameter, checks if the filter object has a where property, if it
   * doesn't, it returns an error message, if it does, it queries the database using the filter object,
   * counts the total number of records that match the filter, calculates the total number of pages,
   * and returns the data and paginated object
   * @param {WhereInput} filter - WhereInput - This is the filter object that is passed to the findMany
   * method.
   * @returns - An object with two properties:
   *     - data: An array of objects that match the filter criteria
   *     - paginated: An object with the following properties:
   *       - currentPage: The current page number
   *       - perPage: The number of records per page
   *       - totalPages: The total number of pages
   *       - totalRecords: The total number
   */
  async findMany(filter: WhereInput) {
    if (!(filter as any)?.where) return 'Invalid Filter Parameter';


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

    if (paginated.currentPage > 1 && paginated.currentPage > paginated.totalPages) return 'NotFoundException';

    return { data, paginated };
  }

  /**
   * It takes a filter object as a parameter, checks if the filter object has a where property, if it
   * doesn't, it returns an error message, if it does, it creates a new object with the where property
   * of the filter object and the where property of the builder object, and then it returns the result
   * of the findFirst method of the modelEntity object
   * @param {WhereInput} filter - WhereInput
   * @returns The first record that matches the filter.
   */
  async one(filter: WhereInput) {
    if (!(filter as any)?.where) return 'Invalid Filter Parameter';

    const { where, skip, take, ...obj } = this.builderObj;

    return (this.modelEntity as any).findFirst({
      where: { ...((filter as any)?.where as object), ...where },
      ...obj,
    }) as Partial<TModelEntity>;
  }

  /**
   * If the value is undefined or null, return an empty array. If the value is an array, return the
   * array with any undefined values removed. If the value is not an array, return an array with the
   * value as the only element
   * @param {any | any[]} val - any | any[]
   * @returns An array of values.
   */
  private toArray(val: any | any[]) {
    if (val == undefined || val == null) return [];

    if (Array.isArray(val)) return val.filter((col) => col != undefined);

    return [val];
  }

  /**
   * It takes an array of strings and returns an object with the same strings as keys and boolean
   * values
   * @param {string[]} selectables - string[] - an array of strings that are the selectable options
   * @param {string[]} array - string[] - the array of strings to convert to a boolean object
   * @returns An object with the keys of the selectables array and the values of the array.
   */
  private arrayToBoolObject(selectables: string[], array: string[]): IAnyObject<boolean> {
    if (array[0] == 'true')
      return this.arrayToBoolObject(selectables, selectables);

    array = _.intersectionWith(array, selectables);

    const obj: IAnyObject<boolean> = {};
    array?.forEach((element) => { obj[element] = true });

    return isObjectEmpty(obj) ? {} : obj;
  }


  /**
   * It takes a filter object, picks only the valid keys, and then recursively filters the object until
   * it's empty
   * @param {object} filterObj - object - The object that you want to filter.
   */
  private filterRecursive(filterObj: object) {
    const validFilterObj: IAnyObject = _.pick(filterObj, [
      ...this.entity.filterableColumns,
      'AND',
      'NOT',
      'OR',
      ...this.entity.filterableReltionship,
    ]);

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

    return validFilterObj;
  }
}

export default ApiQueryBuilder;