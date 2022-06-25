"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
require("reflect-metadata");
const ControllerDecoratorParams_1 = require("./enums/ControllerDecoratorParams");
function Middleware(middlewares) {
    return function (target, propertyKey) {
        Reflect.defineMetadata(ControllerDecoratorParams_1.ControllerDecoratorParams.Middleware, middlewares, target, propertyKey);
    };
}
exports.Middleware = Middleware;
//# sourceMappingURL=Middleware.js.map