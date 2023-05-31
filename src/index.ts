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
String.prototype.tokenReplace = function (obj) {
    let retStr: any = this;
    for (let x in obj) {
        // @ts-ignore
        retStr = retStr.replace(new RegExp("\\:" + x, 'g'), obj[x]).toString();
    }
    return retStr;
};



import BaseChyz from "./BaseChyz";
import {RestClient} from "./base";



/**
 *
 */
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

export * from "./decorator";
export * from "./requiments/Utils";

export default Chyz;

