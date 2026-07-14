/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

// @ts-ignore
import  "reflect-metadata";
export const controller = (prefix: string = ''): ClassDecorator => {
    return (target: any) => {
        // @ts-ignore
        const existingPrefixes: string[] = Reflect.getMetadata('prefixes', target) || [];
        existingPrefixes.push(prefix);
        // @ts-ignore
        Reflect.defineMetadata('prefixes', existingPrefixes, target);

        // Keep backward-compatible 'prefix' metadata (last applied decorator wins, i.e. the topmost one)
        // @ts-ignore
        Reflect.defineMetadata('prefix', prefix, target);

        // Since routes are set by our methods this should almost never be true (except the controller has no methods)
        // @ts-ignore
        if (! Reflect.hasMetadata('routes', target)) {
            // @ts-ignore
            Reflect.defineMetadata('routes', [], target);
        }
    };
};