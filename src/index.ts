/*
 *
 * Copyright (c) 2022.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

declare global {
    interface String {
        tokenReplace(obj: any): string;
    }
}

declare namespace Express {
    export interface Request {
        identity?: string
    }
}

import BaseChyz from "./BaseChyz";
import {RestClient} from "./base";

declare module "express-serve-static-core" {
    interface Request {
        identity: any;
    }
}

String.prototype.tokenReplace = function (obj) {
    let retStr: any = this;
    for (let x in obj) {
        // @ts-ignore
        retStr = retStr.replace(new RegExp("\\:" + x, 'g'), obj[x]).toString();
    }
    return retStr;
};


/**
 *
 */
export  const Chyz_Version="2.0.0-rc.44";
const Chyz = new BaseChyz();
export {Request, Response, NextFunction} from "./base/CRequest";
export {RouteDefinition} from "./model/RouteDefinition";
export {WebUser} from "./web/WebUser";
export {BaseChyz, RestClient}
export {
    Logs,
    ActionFilter,
    BaseError,
    Behavior,
    Component,
    Configurable,
    CWebController,
    DbConnection,
    ForbiddenHttpException,
    InvalidConfigException,
    InvalidArgumentException,
    NotFoundHttpException,
    UnauthorizedHttpException,
    DataErrorDbException,
    ValidationHttpException,
    Model,
    ModelManager,
    CEvents
} from "./base";
export * from "./filters";
export * from "./filters/auth";
export * from "./rbac/";

export * from "./decorator";
export * from "./requiments/Utils";

export default Chyz;

