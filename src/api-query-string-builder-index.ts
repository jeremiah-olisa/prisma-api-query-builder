import * as qs from 'qs';
import { defaultOptions } from './query-builder.constant';
import type { AllQueryBuilderMethodArgs, IQueryFieldParams } from "../types";


class QueryStringBuilder {
    private queryFields: IQueryFieldParams = {
        limit: defaultOptions.perPage,
        page: defaultOptions.currentPage,
        sort: '',
        select: '',
        include: '',
        filter: '',
    };

    filter(filter: AllQueryBuilderMethodArgs['filter']) {
        this.queryFields.filter = qs.stringify(filter)

        return this;
    }

    include(include: AllQueryBuilderMethodArgs['include']) {
        this.queryFields.include = qs.stringify(include)

        return this;
    }

    select(select: AllQueryBuilderMethodArgs['select']) {
        this.queryFields.select = select.join(',')

        return this;
    }

    sort(sort: AllQueryBuilderMethodArgs['sort']) {
        this.queryFields.sort = sort.join(',')
        return this;
    }

    paginate(paginate: AllQueryBuilderMethodArgs['paginate']) {
        this.queryFields.limit = paginate.limit
        this.queryFields.page = paginate.page

        return this;
    }

    all({ filter, include, paginate, select, sort }: Partial<AllQueryBuilderMethodArgs>) {
        filter && this.filter(filter)
        include && this.include(include)
        paginate && this.paginate(paginate)
        select && this.select(select)
        sort && this.sort(sort)
        return this
    }

    build() {
        return qs.stringify(this.queryFields)
    }
}
export default QueryStringBuilder