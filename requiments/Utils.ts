/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
// import _ from "lodash";
import {Utils} from "sequelize";

const _ = require('lodash');

// This is essentially what the new keyword does
const factory = (clazz: any, props: any = null) => {
    // @ts-ignore
    // var args = [].slice.call(props, 1);
    var obj = {};
    // @ts-ignore
    obj.__proto__ = clazz.prototype;
    var result = new clazz(props);
    return (typeof result !== 'undefined') ? result : obj;
    // let obj = {
    //     __proto__: undefined
    // };
    // obj.__proto__ = clazz.prototype;
    // var result = clazz.call(obj);
    // return (typeof result !== 'undefined') ? result : obj;
};

const ucwords = (str: string) => {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
}

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

const findKeyValue = (object: any, findKey: string) => {
    let key = Object.keys(object).find(key => key.toLowerCase() === findKey.toLowerCase())
    if (key) {
        return object[key];
    }

    return null
}


const sleep = (seconds = 1) => {
    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while (waitTill > new Date()) {
    }
}


function wildTest(wildcard: string, str: string) {
    let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&'); // regexp escape
    const re = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`, 'i');
    return re.test(str); // remove last 'i' above to have case sensitive
}

const matchWildcard = (pattern: string, string: string, options: any = {}) => {
    return wildTest(pattern, string)
}

const preg_match = (regex:any, str:string) =>{
    if (new RegExp(regex).test(str)){
        return regex.exec(str);
    }
    return false;
}

export default {
    createObject,
    findKeyValue,
    sleep,
    matchWildcard,
    factory,
    ucwords,
    preg_match,
    ..._
}
