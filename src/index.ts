/*
 *
 * Copyright (c) 2022.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

declare namespace Express {
    export interface Request {
        identity?: string
    }
}

import { Express } from "express-serve-static-core"
declare module "express-serve-static-core" {
    interface Request {
        identity: any;
    }
}


import {RestClient} from "./base/RestClient";
import BaseChyz from "./BaseChyz";

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

