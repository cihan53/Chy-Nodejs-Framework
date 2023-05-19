/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
// import _ from "lodash";

const _ = require('lodash');
/**
 *
 * @param prefix
 * @param val
 * @param top
 */
var buildParams = function (prefix: string, val: any, top?: boolean) {
    if (_.isUndefined(top)) top = true;
    if (_.isArray(val)) {
        return _.map(val, function (value: any, key: string) {
            return buildParams(top ? key : prefix + '[]', value, false);
        }).join('&');
    } else if (_.isObject(val)) {
        return _.map(val, function (value: any, key: string) {
            return buildParams(top ? key : prefix + '[' + key + ']', value, false);
        }).join('&');
    } else {
        return encodeURIComponent(prefix) + '=' + encodeURIComponent(val);
    }
};
/**
 *Creates a query string from a hash
 * @param obj
 */
const toQuery = function (obj: any) {
    return buildParams('', obj);
}

/**
 *
 * @param object
 * @param params
 */
const createObject = (object: any, params: any) => {
    let newParams: any = {}
    Object.keys(params).forEach((param) => {
        newParams[param] = {}
        Object.assign(newParams[param], {
            writable: true,
            configurable: true,
            value: params[param]
        });
    })
    return Object.create(object, newParams);
}
/**
 *
 * @param object
 * @param findKey
 */
const findKeyValue = (object: any, findKey: string) => {
    let key = Object.keys(object).find(key => key.toLowerCase() === findKey.toLowerCase())
    if (key) {
        return object[key];
    }

    return null
}

/**
 *
 * @param seconds
 */
const sleep = (seconds = 1) => {
    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while (waitTill > new Date()) {
    }
}

/**
 *
 * @param wildcard
 * @param str
 */
function wildTest(wildcard: string, str: string) {
    let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&'); // regexp escape
    const re = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`, 'i');
    return re.test(str); // remove last 'i' above to have case sensitive
}

/**
 *
 * @param pattern
 * @param string
 * @param options
 */
const matchWildcard = (pattern: string, string: string, options: any = {}) => {
    return wildTest(pattern, string)
}


/**
 * random string genrate
 * @param length
 * @param randomString
 */
const generateRandomString = function (length: number, randomString = ""): string {
    randomString += Math.random().toString(20).substr(2, length);
    if (randomString.length > length) return randomString.slice(0, length);
    return generateRandomString(length, randomString);
};

export const Utils = {
    findKeyValue,
    createObject,
    sleep,
    matchWildcard,
    toQuery,
    generateRandomString,
    ..._
}

