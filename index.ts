export {Request, Response, NextFunction} from "express";
export * from "./base";
export * from "./filters";
export * from "./filters/auth";
export * from "./decorator";
export * from "./BaseChyz";
export * from "./requiments/Utils";
export {RouteDefinition} from "./model/RouteDefinition";

import BaseChyz from "./BaseChyz";
const Chyz = new BaseChyz();

export default Chyz;