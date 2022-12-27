import type { PrismaValidStringFilter, IQueryOptionProps, IQueryFieldParams, WithRequiredProperty  } from "../types";

/* A type definition for the defaultQueryFields object. */
export const defaultQueryFields: WithRequiredProperty<IQueryFieldParams, 'limit' | 'page' | 'sort' | 'select' | 'include' | 'filter'> = {
    limit: 15,
    page: 1,
    sort: 'createdAt',
    select: '',
    include: '',
    filter: '',
};

/* Defining the defaultOptions object. */
export const defaultOptions: WithRequiredProperty<IQueryOptionProps, 'currentPage' | 'perPage'> = {
    currentPage: 1,
    perPage: 15,
}

/* Defining the defaultPrismaStringFilter constant. */
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

/**
 * It checks if the object is not null, has no keys, and is an object
 * @param {object} obj - object - The object to check if it's empty.
 */
export const isObjectEmpty = (obj: object) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

/* It's a shorthand for `export const take = (defaultOptions.perPage * 1) || 50;` */
export const take = defaultOptions.perPage * 1 || 50;

/* It's a shorthand for `export const skip = ((defaultOptions.currentPage * 1 || 1) - 1) *
(defaultOptions.perPage * 1 || 50);` */
export const skip = ((defaultOptions.currentPage * 1 || 1) - 1) * (defaultOptions.perPage * 1 || 50);