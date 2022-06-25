"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const createObject = (object, params) => {
    let newParams = {};
    Object.keys(params).forEach((param) => {
        newParams[param] = {};
        Object.assign(newParams[param], {
            writable: true,
            configurable: true,
            value: params[param]
        });
    });
    return Object.create(object, newParams);
};
const findKeyValue = (object, findKey) => {
    let key = Object.keys(object).find(key => key.toLowerCase() === findKey.toLowerCase());
    if (key) {
        return object[key];
    }
    return null;
};
const sleep = (seconds = 1) => {
    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while (waitTill > new Date()) {
    }
};
function wildTest(wildcard, str) {
    let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&'); // regexp escape
    const re = new RegExp(`^${w.replace(/\*/g, '.*').replace(/\?/g, '.')}$`, 'i');
    return re.test(str); // remove last 'i' above to have case sensitive
}
const matchWildcard = (pattern, string, options = {}) => {
    return wildTest(pattern, string);
};
const t = function (text) {
    return text;
};
exports.default = Object.assign({ t,
    createObject,
    findKeyValue,
    sleep,
    matchWildcard }, _);
//# sourceMappingURL=Utils.js.map