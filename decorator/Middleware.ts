import "reflect-metadata";
import { ControllerDecoratorParams } from "./enums/ControllerDecoratorParams";
import { RequestHandler } from "express";

export function Middleware(middlewares: RequestHandler[]): Function {
    return function(target: any, propertyKey: string): void {
        Reflect.defineMetadata(ControllerDecoratorParams.Middleware, middlewares, target, propertyKey);
    }
}