import * as qs from 'qs';
import { defaultOptions } from './query-builder.constant';
import type { AllQueryBuilderMethodArgs, IQueryFieldParams } from "../types";

/* It's a class that builds a query string based on the arguments passed to it. */
class QueryStringBuilder {
    /* It's a private property that holds the query fields. */
    private queryFields: IQueryFieldParams = {
        limit: defaultOptions.perPage,
        page: defaultOptions.currentPage,
        sort: '',
        select: '',
        include: '',
        filter: '',
    };

    /**
     * The function takes an object as an argument, converts it to a query string, and assigns it to
     * the queryFields.filter property
     * @param filter - AllQueryBuilderMethodArgs['filter']
     * @returns The query builder object itself.
     */
    filter(filter: AllQueryBuilderMethodArgs['filter']) {
        this.queryFields.filter = qs.stringify(filter)
        return this;
    }

    /**
     * The function takes an object of type `AllQueryBuilderMethodArgs['include']` and returns a `this`
     * of type `AllQueryBuilderMethodArgs['include']`
     * @param include - AllQueryBuilderMethodArgs['include']
     * @returns The query builder object itself.
     */
    include(include: AllQueryBuilderMethodArgs['include']) {
        this.queryFields.include = qs.stringify(include)
        return this;
    }

    /**
     * This function takes an array of strings and joins them together with a comma, then assigns the
     * result to a property on the object that called the function.
     * @param select - string[]
     * @returns The query builder object itself.
     */
    select(select: AllQueryBuilderMethodArgs['select']) {
        this.queryFields.select = select.join(',')
        return this;
    }

    /**
     * The function takes an array of strings and joins them together with a comma
     * @param sort - string[]
     * @returns The queryFields object.
     */
    sort(sort: AllQueryBuilderMethodArgs['sort']) {
        this.queryFields.sort = sort.join(',');
        return this;
    }

    /**
     * This function takes an object with two properties, limit and page, and sets the queryFields
     * object's limit and page properties to the values of the limit and page properties of the
     * paginate object.
     * @param paginate - AllQueryBuilderMethodArgs['paginate']
     * @returns The query builder instance.
     */
    
    paginate(paginate: AllQueryBuilderMethodArgs['paginate']) {
        this.queryFields.limit = paginate.limit
        this.queryFields.page = paginate.page
        return this;
    }

    /**
     * "If the argument is not null, then call the corresponding method on the query builder."
     * 
     * The above function is a good example of how to use the Partial type.
     * @param  - Partial<AllQueryBuilderMethodArgs>
     * @returns The QueryBuilder instance.
     */
    all({ filter, include, paginate, select, sort }: Partial<AllQueryBuilderMethodArgs>) {
        filter && this.filter(filter)
        include && this.include(include)
        paginate && this.paginate(paginate)
        select && this.select(select)
        sort && this.sort(sort)
        return this
    }

    /**
     * It takes an object, converts it to a string, and then returns the string
     * @returns The query string
     */
    build() {
        return qs.stringify(this.queryFields)
    }
}

export default QueryStringBuilder