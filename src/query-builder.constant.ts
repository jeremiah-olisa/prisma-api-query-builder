import type { PrismaValidStringFilter, IQueryOptionProps, IQueryFieldParams, WithRequiredProperty  } from "../types";

export const defaultQueryFields: WithRequiredProperty<IQueryFieldParams, 'limit' | 'page' | 'sort' | 'select' | 'include' | 'filter'> = {
    limit: 15,
    page: 1,
    sort: 'createdAt',
    select: '',
    include: '',
    filter: '',
};



export const defaultOptions: WithRequiredProperty<IQueryOptionProps, 'currentPage' | 'perPage'> = {
    currentPage: 1,
    perPage: 15,
}



export const defaultPrismaStringFilter: PrismaValidStringFilter[] = [
    'equals',
    'in',
    'notIn',
    'lt',
    'lte',
    'gt',
    'gte',
    'contains',
    'startsWith',
    'endsWith',
    'mode',
    'not',
]

export const isObjectEmpty = (obj: object) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};


export const take = defaultOptions.perPage * 1 || 50;
export const skip = ((defaultOptions.currentPage * 1 || 1) - 1) * (defaultOptions.perPage * 1 || 50);