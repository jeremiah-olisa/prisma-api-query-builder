// CREDITS: https://github.com/xpepermint/query-types/blob/master/index.js
export const isObject = (val) => {
    return val.constructor === Object;
}

export const isNumber = (val) => {
    return !isNaN(parseFloat(val)) && isFinite(val);
}

export const isBoolean = (val) => {
    return val === 'false' || val === 'true';
}

export const isArray = (val) => {
    return Array.isArray(val);
}

export const parseObject = (obj) => {
    var result = {};
    var key, val;
    for (key in obj) {
        val = parseValue(obj[key]);
        if (val !== null) result[key] = val; // ignore null values
    }
    return result;
}

export const parseArray = (arr) => {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        result[i] = parseValue(arr[i]);
    }
    return result;
}

export const parseNumber = (val) => {
    return Number(val);
}

export const parseBoolean = (val) => {
    return val === 'true';
}


export const parseValue = (val) => {
    if (typeof val == 'undefined' || val == '') {
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
    return (req, res, next) => {
        req.query = parseObject(req.query);
        next();
    }
}