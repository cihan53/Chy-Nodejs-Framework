import {NotFoundHttpException} from "./base/NotFoundHttpException";

require('dotenv-flow').config();
import 'reflect-metadata';
import {RouteDefinition} from "./model/RouteDefinition";
import {NextFunction, Request, Response} from "express";
import express from 'express';
import {Controller} from "./base/Controller";
import Utils from "./requiments/Utils";


const log4js = require("log4js");
const fs = require('fs');
const _ = require('lodash');

var bodyParser = require('body-parser')
var methodOverride = require('method-override')


export default class BaseChyz {
    private config: any;
    static app: string;
    static express = express()
    private _port: number = 3001;
    static db: any;
    static routes: any;
    private _logConfig: any = require('./log/config/log4js.json') ?? {}
    private _controllerpath: string = "Controllers"
    private static controllers: Array<Controller> = []
    private static components: any = {}

    // public ac: any = new AccessControl();


    get logConfig(): any {
        return this._logConfig;
    }

    set logConfig(value: any) {
        this._logConfig = value;
    }

    get controllerpath(): string {
        return this._controllerpath;
    }

    set controllerpath(value: string) {
        this._controllerpath = value;
    }

    init() {
        this.logProvider().level = log4js.levels.ALL;
        this.logProvider().configure(this._logConfig);

        /**
         * set request id
         */
        Object.defineProperty(BaseChyz.express.request, 'reqId', {
            configurable: true,
            enumerable: true,
            writable: true
        })

        Object.defineProperty(BaseChyz.express.request, 'user', {
            configurable: true,
            enumerable: true,
            writable: true
        })


        Object.defineProperty(BaseChyz.express.request, 'identity', {
            configurable: true,
            enumerable: true,
            writable: true
        })


        /**
         * server port setting
         */
        if (this.config.hasOwnProperty("port"))
            this.port = this.config.port;

        /**
         * controller path
         */
        if (this.config.controllerpath) {
            this.controllerpath = this.config.controllerpath
        }

        /**
         * Express Server
         */
        this.middleware()

        /**
         * Load Controller
         */
        this.loadController();


    }

    /**
     * Listen port number
     * Server port number get
     */
    get port(): number {
        return this._port;
    }

    /**
     * Listen port number
     * Server port number setting
     * @param value
     */
    set port(value: number) {
        this._port = value;
    }


    app(config: any = {}) {

        /**
         * Config set
         */
        this.config = config;

        this.init();

        let components = Utils.findKeyValue(config, "components")
        if (components) {
            for (const componentsKey in components) {
                let comp = components[componentsKey];
                BaseChyz.components[componentsKey] = Utils.createObject(new comp.class, comp);
                BaseChyz.components[componentsKey]?.init();
            }
        }

        return this;
    }


    public logProvider() {
        return log4js;
    }


    static logs(...args: any[]) {
        return log4js.getLogger(this.name);
    }

    public static info(...args: any[]) {
        BaseChyz.logs().info(...arguments)
    }

    public static error(...args: any[]) {
        BaseChyz.logs().error(...arguments)
    }

    public static debug(...args: any[]) {
        BaseChyz.logs().debug(...arguments)
    }

    public static warning(...args: any[]) {
        BaseChyz.logs().warn(...arguments)
    }

    public static t(text: string) {
        return text;
    }


    public errorLogger(error: any, req: any, res: any, next: any) { // for logging errors
        BaseChyz.error(error)
        next(error) // forward to next middleware
    }

    public errorResponder(error: any, req: any, res: any, next: any) { // responding to client
        if (error.type == 'redirect')
            res.redirect('/error')
        else if (error.type == 'time-out') // arbitrary condition check
            res.status(408).send(error)
        else
            next(error) // forwarding exceptional case to fail-safe middleware
    }


    public errorHandler(err: any, req: any, res: any, next: any) {
        if (res.headersSent) {
            return next(err)
        }
        res.status(500)
        res.json('error', {error: err})
    }

    public static getComponent(key: any) {
        return BaseChyz.components[key] ?? null
    }

    /**
     * load contoller
     */
    async loadController() {
        let articlesEndpoints: string[] = [];
        fs.readdirSync(`${this._controllerpath}/`).forEach((file: string) => {
            let controller = require(`${this._controllerpath}/${file}`);
            // let controller = require(`../../../${this._controllerpath}/${file}`);


            // This is our instantiated class
            const instance: Controller = new controller();

            BaseChyz.controllers.push(instance);

            // The prefix saved to our controller
            // @ts-ignore
            const prefix = Reflect.getMetadata('prefix', controller);
            // Our `routes` array containing all our routes for this controller
            // @ts-ignore
            const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);
            BaseChyz.logs().debug("Controller load ", controller.name, `(${prefix})`)

            if (routes) {
                routes.forEach(route => {

                    let actionId = route.path == "/" || route.path == "" ? instance.defaultAction : route.path;
                    route.id = actionId;
                    BaseChyz.logs().debug("Controller route Path", prefix + (route.path.startsWith("/") ? route.path : `/${route.path}`))

                    BaseChyz.express[route.requestMethod](prefix + (route.path.startsWith("/") ? route.path : `/${route.path}`),
                        async (req: Request, res: Response, next: NextFunction) => {
                            try {
                                BaseChyz.logs().debug(`Call Request id ${instance.id}`)
                                await instance.beforeAction(route, req, res)
                                next()
                            } catch (e) {
                                BaseChyz.logs().error(e);

                                res.status(e.statusCode)
                                res.json({error: {code: e.statusCode, name: e.name, message: e.message}})
                                // next(e)
                            }

                        },
                        (req: Request, res: Response,) => {
                            // @ts-ignore
                            BaseChyz.logs().debug("Request ID ", req.reqId)
                            // @ts-ignore
                            instance[route.methodName](req, res);
                            instance.afterAction(route, req, res)

                        })


                });
            }
        })
    }

    public middleware() {

        BaseChyz.express.use(bodyParser.json())
        BaseChyz.express.use(methodOverride())
        BaseChyz.express.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
        BaseChyz.express.use(this.errorLogger)
        BaseChyz.express.use(this.errorResponder)
        BaseChyz.express.use(this.errorHandler)

        // CORS
        BaseChyz.express.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
            next();
        });


        // Use middleware to set the default Content-Type
        // BaseChyz.express.use(async (req: Request, res: Response, next: NextFunction) => {
        //     // @ts-ignore
        //     req.reqId = Utils.uniqueId("chyzzzz_")
        //     res.header('Content-Type', 'application/json');
        //
        //     let c = _.trimStart(req.path, "/");
        //     c = c.split("/");
        //     let prefix = c[0];
        //     let action = c.length > 1 ? c[1] : "";
        //
        //     BaseChyz.logs().debug(`Call Request1 ${prefix}/${action}`)
        //     // @ts-ignore
        //     let controller: Controller = null
        //     for (const _controller of BaseChyz.controllers) {
        //         if (_controller.id == prefix) {
        //             controller = _controller;
        //             break;
        //         }
        //     }
        //
        //
        //     try {
        //         if (controller == null) {
        //             throw new NotFoundHttpException("Not found URL")
        //         }
        //
        //         let actionId = action == "/" || action == "" ? controller.defaultAction : action;
        //         let route: RouteDefinition = {
        //             id: actionId,
        //             path: req.path,
        //             // @ts-ignore
        //             requestMethod: req.method.toLowerCase() ?? "get",
        //             methodName: ""
        //         }
        //
        //         BaseChyz.logs().debug(`Call Request id ${controller.id}`)
        //         await controller.beforeAction(route, req, res)
        //         next();
        //     } catch (e) {
        //         BaseChyz.error(e)
        //         res.status(e.statusCode)
        //         res.json({error: {code: e.statusCode, name: e.name, message: e.message}})
        //         // next(e)
        //     }
        //
        // });


    }


    public Start() {

        BaseChyz.info("Express Server Starting")
        BaseChyz.express.listen(this._port, () => {
            BaseChyz.info("Express Server Start ")
            BaseChyz.info(`Liten Port ${this._port}`)
        })
        return this;
    }


}