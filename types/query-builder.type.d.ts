import type { PrismaWhereInput } from "./prisma-query.type";


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

export type IBuilderObj = {
    take: number;
    skip: number;
    where: object;
    select: object;
    include: object;
    orderBy: object;
}

export type QueryBuilder = {
    paginate: { take: number; skip: number };
    sort: object;
    select: object;
    filter: object;
    include: object;
    paginated: {
        pages: number;
        currentPage: number;
    };
}

export type IPaginated = {
    totalPages: number;
    totalRecords?: number;
    perPage: number;
    currentPage: number;
}


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

export type IQueryFieldParams = {
    limit?: number;
    page?: number;
    sort?: string;
    select?: string;
    include?: string;
    filter?: string;
}

export type IncludeInput = {
    [x: string]: string[]
}

export type AllQueryBuilderMethodArgs = {
    filter: PrismaWhereInput
    include: IncludeInput
    select: string[]
    sort: string[]
    paginate: Pick<IQueryFieldParams, 'limit' | 'page'>
}

/* An interface that is used to define the properties of the class. */
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

export type IAnyObject<ValueType = any, PropertyType extends string = string> = {
    [x in PropertyType]: ValueType;
};