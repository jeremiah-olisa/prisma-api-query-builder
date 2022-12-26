import type { ParsedQs } from "qs";

// CREDITS: https://github.com/xpepermint/query-types/blob/master/index.js
export const isObject = (val: any) => {
    return val.constructor === Object;
}

export const isNumber = (val: any) => {
    return !isNaN(parseFloat(val)) && isFinite(val);
}

export const isBoolean = (val: any) => {
    return val === 'false' || val === 'true';
}

export const isArray = (val: any) => {
    return Array.isArray(val);
}

export const parseObject = (obj: ParsedQs) => {
    var result = {};
    var key, val;
    for (key in obj) {
        val = parseValue(obj[key]);
        if (val !== null) result = { [key]: val }; // ignore null values
    }
    return result;
}

export const parseArray = (arr: string | any[]): any[] => {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        result[i] = parseValue(arr[i]);
    }
    return result;
}

export const parseNumber = (val: any) => {
    return Number(val);
}

export const parseBoolean = (val: any) => {
    return val === 'true';
}


export const parseValue = (val: any) => {
    if (typeof val === 'undefined' || val === '') {
        return null;
    } else if (isBoolean(val)) {
        return parseBoolean(val);
    } else if (isArray(val)) {
        return parseArray(val);
    } else if (isObject(val)) {
        return parseObject(val);
    } else if (isNumber(val)) {
        return parseNumber(val);
    } else {
        return val;
    }
}

export const queryParseMiddleware = () => {
    return (req: { query: ParsedQs; }, _res: any, next: () => void) => {
        req.query = parseObject(req.query);
        next();
    }
}