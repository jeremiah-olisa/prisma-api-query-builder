import type { PrismaWhereInput } from "./prisma-query.type";

/**
 * It's a generic type that takes in a BaseEntity, Columns, and RelationShips as type parameters.
 * The BaseEntity is the base entity that the type will extend.
 * The Columns is the type of the columns that the type will have.
 * The RelationShips is the type of the relationShips that the type will have.
 * The type has a bunch of properties that are of type Columns, RelationShips, and string.
 * @property {Columns[]} filterableColumns - columns that the api can filter any other column passed in the query string would be rejected without an error
 * @property {Columns[]} selectableColumns - columns that the api can select any other column passed in the query string would be rejected without an error
 * @property {RelationShips[]} filterableReltionship - relations that the api can filter from any other relation passed in the query string would be rejected without an error
 * @property {string[]} filterableReltionshipColumns - relational columns that the api can filter from any other relational column passed in the query string would be rejected without an error
 * @property {Columns[]} sortableColumns - columns that the api can sort by any other colomn passed in the query string would be rejected without an error
 * @property {RelationShips[]} allowedRelationShips - relational columns that the api can include into the response data any other relational colomn passed in the query string would be rejected without an error
 * @property {{ [x in RelationShips]: string[] }} selectableRelationShips - relational columns that the api can select any other relational colomn passed in the query string would be rejected without an error
 */
export type IModelEntity<BaseEntity = {}, Columns = string, RelationShips = string> = {
    filterableColumns: Columns[];
    selectableColumns: Columns[];
    filterableReltionship: RelationShips[];
    filterableReltionshipColumns: string[];
    sortableColumns: Columns[];
    allowedRelationShips: RelationShips[];
    selectableRelationShips: { [x in RelationShips]: string[] };
} & BaseEntity

type FilterStartsWith<
    Set,
    Needle extends string,
> = Set extends `${Needle}${infer _X}` ? Set : never;

export type FilteredPrismaKeys<PrismaClient> = FilterStartsWith<keyof PrismaClient, '$'>;

export type TableNames<PrismaClient> = keyof Omit<PrismaClient, FilteredPrismaKeys<PrismaClient>>;

/**
 * IBuilderObj is an object with the properties take, skip, where, select, and orderBy, where each
 * property is a number, object, or undefined.
 * @property {number} take - number of records to return
 * @property {number} skip - number of records to skip
 * @property {object} where - {
 * @property {object} select - {
 * @property {object} orderBy - {
 */
export type IBuilderObj = {
    take: number;
    skip: number;
    where: object;
    select: object;
    orderBy: object;
}

/**
 * A QueryBuilder is an object with a paginate property that is an object with a take and skip
 * property, a sort property that is an object, a select property that is an object, a filter property
 * that is an object, and a paginated property that is an object with a pages and currentPage property.
 * @property paginate - { take: number; skip: number };
 * @property {object} sort - { field: 'name', order: 'asc' }
 * @property {object} select - The fields you want to select from the database.
 * @property {object} filter - This is the filter object that will be passed to the mongoose query.
 * @property paginated - { pages: number; currentPage: number }
 */
export type QueryBuilder = {
    paginate: { take: number; skip: number };
    sort: object;
    select: object;
    filter: object;
    paginated: {
        pages: number;
        currentPage: number;
    };
}

/**
 * IPaginated is an object with a number property called totalPages, an optional number property called
 * totalRecords, a number property called perPage, and a number property called currentPage.
 * @property {number} totalPages - The total number of pages.
 * @property {number} totalRecords - The total number of records in the database.
 * @property {number} perPage - The number of records to show per page.
 * @property {number} currentPage - The current page number
 */
export type IPaginated = {
    totalPages: number;
    totalRecords?: number;
    perPage: number;
    currentPage: number;
}


/**
 * IQueryOptionProps is an object with optional properties perPage, currentPage, value, field, sort,
 * select, include, and filter.
 * @property {number} perPage - number of items per page
 * @property {number} currentPage - The current page number
 * @property {string} value - The value to search for.
 * @property {string} field - The field to search on.
 * @property {string[]} sort - An array of strings that represent the fields to sort by.
 * @property {string[]} select - The fields you want to select from the table.
 * @property include - This is used to include related data in the response.
 * @property filter - The filter object is used to filter the results.
 */
export type IQueryOptionProps = {
    perPage?: number,
    currentPage?: number,
    value?: string,
    field?: string,
    sort?: string[];
    select?: string[];
    include?: {
        [key in string]: string
    };
    filter?: {
        [key in string]: any
    };
}

/**
 * IQueryFieldParams is an object with optional properties limit, page, sort, select, include, and
 * filter, where each property is a number, string, or undefined.
 * @property {number} limit - The number of records to return.
 * @property {number} page - The page number to return.
 * @property {string} sort - The sort order of the results.
 * @property {string} select - A comma-separated list of fields to include in the response.
 * @property {string} include - A list of related models to include in the response.
 * @property {string} filter - A string that contains the filter criteria.
 */
export type IQueryFieldParams = {
    limit?: number;
    page?: number;
    sort?: string;
    select?: string;
    include?: string;
    filter?: string;
}

/**
 * `IncludeInput` is an object whose keys are strings and whose values are arrays of strings.
 * @property {string[]} [x: string[]] - string[]
 */
export type IncludeInput = {
    [x: string]: string[]
}

/**
 * AllQueryBuilderMethodArgs is a type that is an object with a filter property that is a
 * PrismaWhereInput, an include property that is an IncludeInput, a select property that is an array of
 * strings, a sort property that is an array of strings, and a paginate property that is an object with
 * a limit property that is a number and a page property that is a number.
 * @property {PrismaWhereInput} filter - PrismaWhereInput
 * @property {IncludeInput} include - IncludeInput
 * @property {string[]} select - string[]
 * @property {string[]} sort - string[]
 * @property paginate - {
 */
export type AllQueryBuilderMethodArgs = {
    filter: PrismaWhereInput
    include: IncludeInput
    select: string[]
    sort: string[]
    paginate: Pick<IQueryFieldParams, 'limit' | 'page'>
}

/**
 * IQueryFields is an object with optional properties limit, page, sort, select, include, and filter.
 * @property {number} limit - The maximum number of records to return.
 * @property {number} page - The page number to return.
 * @property {string} sort - The field to sort by.
 * @property {string} select - A comma-separated list of fields to include in the response.
 * @property {string} include - The related models to include in the response.
 * @property {string} filter - A string that contains the filter criteria.
 */
export type IQueryFields = {
    limit?: number;
    page?: number;
    sort?: string;
    select?: string;
    include?: string;
    filter?: string;
}

export type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
    [Property in Key]-?: Type[Property];
};

/**
 * IAnyObject is an object with any number of properties, where each property has a value of type
 * ValueType.
 * @property {ValueType} [: ValueType] - ValueType;
 */
export type IAnyObject<ValueType = any, PropertyType extends string = string> = {
    [x in PropertyType]: ValueType;
};