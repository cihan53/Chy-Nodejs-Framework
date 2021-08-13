require('dotenv-flow').config();
import 'reflect-metadata';
import {RouteDefinition} from "./model/RouteDefinition";
import {Request, Response} from "express";
import * as express from 'express';
import {Controller} from "./base/Controller";
import Utils from "./requiments/Utils";


const log4js = require("log4js");
const fs = require('fs');
const _ = require('lodash');

var bodyParser = require('body-parser')
var methodOverride = require('method-override')


function runAsyncWrapper(callback) {
    return function (req, res, next) {
        callback(req, res, next)
            .catch(next)
    }
}


export default class BaseChyz {
    static app: string;
    static express = express()
    private _port: number = 3001;
    static db: any;
    static routes: any;
    public logConfig: any = require('./log/config/log4js.json')
    public controllerpath: string = "Controllers"
    private static controllers: Array<Controller> = []
    private static components: any = {}

    // public ac: any = new AccessControl();


    constructor() {
        this.logProvider().level = log4js.levels.ALL;
        this.logProvider().configure(this.logConfig);

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

    static getVersion(): string {
        return '1.0.0-dev'
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

    public static t(text) {
        return text;
    }


    public errorLogger(error, req, res, next) { // for logging errors
        BaseChyz.error(error)
        next(error) // forward to next middleware
    }

    public errorResponder(error, req, res, next) { // responding to client
        if (error.type == 'redirect')
            res.redirect('/error')
        else if (error.type == 'time-out') // arbitrary condition check
            res.status(408).send(error)
        else
            next(error) // forwarding exceptional case to fail-safe middleware
    }


    public errorHandler(err, req, res, next) {
        if (res.headersSent) {
            return next(err)
        }
        res.status(500)
        res.json('error', {error: err})
    }

    public static getComponent(key) {
        return BaseChyz.components[key] ?? null
    }

    /**
     * load contoller
     */
    async loadController() {
        let articlesEndpoints: string[] = [];
        fs.readdirSync(`${this.controllerpath}/`).forEach((file: string) => {
            let controller = require(`../${this.controllerpath}/${file}`);


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
                        runAsyncWrapper(async (req: Request, res: Response, next) => {
                            // @ts-ignore
                            BaseChyz.logs().debug("Request ID ", req.reqId)
                            instance[route.methodName](req, res);
                            instance.afterAction(route, req, res)

                            // try {
                            //     //await instance.beforeAction(route, req, res)
                            //
                            // } catch (e) {
                            //     BaseChyz.error(e)
                            //     res.status(e.statusCode)
                            //     res.json({error: {code: e.statusCode, name: e.name, message: e.message}})
                            // }
                        }));
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


        // Use middleware to set the default Content-Type
        BaseChyz.express.use(async function (req, res, next) {
            // @ts-ignore
            req.reqId = Utils.uniqueId("chyzzzz_")
            res.header('Content-Type', 'application/json');

            let c = _.trimStart(req.path, "/");
            c = c.split("/");
            let prefix = c[0];
            let action = c.length > 1 ? c[1] : "";

            BaseChyz.logs().debug(`Call Request1 ${prefix}/${action}`)
            let controller
            for (const _controller of BaseChyz.controllers) {
                if (_controller.id == prefix) {
                    controller = _controller;
                    break;
                }
            }


            let actionId = action == "/" || action == "" ? controller.defaultAction : action;
            let route: RouteDefinition = {
                id: actionId,
                path: req.path,
                // @ts-ignore
                requestMethod: req.method.toLowerCase() ?? "get",
                methodName: ""
            }

            BaseChyz.logs().debug(`Call Request id ${controller.id}`)
            try {
                await controller.beforeAction(route, req, res)
                next();
            } catch (e) {
                BaseChyz.error(e)
                res.status(e.statusCode)
                res.json({error: {code: e.statusCode, name: e.name, message: e.message}})
                // next(e)
            }

        });


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