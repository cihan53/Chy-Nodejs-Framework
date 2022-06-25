"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
// @ts-ignore
require("reflect-metadata");
const controller = (prefix = '') => {
    return (target) => {
        // @ts-ignore
        Reflect.defineMetadata('prefix', prefix, target);
        // Since routes are set by our methods this should almost never be true (except the controller has no methods)
        // @ts-ignore
        if (!Reflect.hasMetadata('routes', target)) {
            // @ts-ignore
            Reflect.defineMetadata('routes', [], target);
        }
    };
};
exports.controller = controller;
//# sourceMappingURL=controller.js.map