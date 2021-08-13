/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
// @ts-ignore
import "reflect-metadata";
import {RouteDefinition} from '../model/RouteDefinition';

export const get = (path: string): MethodDecorator => {
    // `target` equals our class, `propertyKey` equals our decorated method name
    return (target, propertyKey: string): void => {
        // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
        // To prevent any further validation simply set it to an empty array here.
        // @ts-ignore
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            // @ts-ignore
            Reflect.defineMetadata('routes', [], target.constructor);
        }

        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        // @ts-ignore
        const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

        routes.push({
            id:"",
            requestMethod: 'get',
            path,
            methodName: propertyKey
        });

        // @ts-ignore
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};