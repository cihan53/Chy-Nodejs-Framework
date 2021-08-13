/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
// import _ from "lodash";
const _ = require('lodash');

const createObject = (object, params) => {
    let newParams = {}
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

const findKeyValue = (object, findKey) => {
    let key = Object.keys(object).find(key => key.toLowerCase() === findKey.toLowerCase())
    if (key) {
        return object[key];
    }

    return null
}


const sleep=(seconds=1)=>{
    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while(waitTill > new Date()){}
}
export default {
    createObject,
    findKeyValue,
    sleep,
    ..._
}