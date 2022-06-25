"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
// @ts-ignore
require("reflect-metadata");
const get = (path) => {
    // `target` equals our class, `propertyKey` equals our decorated method name
    // @ts-ignore
    return (target, propertyKey) => {
        // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
        // To prevent any further validation simply set it to an empty array here.
        // @ts-ignore
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            // @ts-ignore
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        // @ts-ignore
        const routes = Reflect.getMetadata('routes', target.constructor);
        routes.push({
            id: "",
            requestMethod: 'get',
            path,
            methodName: propertyKey
        });
        // @ts-ignore
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};
exports.get = get;
//# sourceMappingURL=get.js.map