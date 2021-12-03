import 'reflect-metadata';
import {RouteDefinition} from "./model/RouteDefinition";
import {NextFunction, Request, Response} from "express";
import {Controller} from "./base/Controller";
import Utils from "./requiments/Utils";
import {ModelManager} from "./base";


const express = require("express");
const log4js = require("log4js");
const fs = require('fs');
const validate = require('validate.js');

var ip = require('ip');
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

export {Request, Response, NextFunction} from "express";
export default class BaseChyz {
    private config: any;
    static app: string;
    static express = express()
    private _port: number = 3001;
    static db: any;
    static routes: any;
    private static _validate:any=validate;
    private _logConfig: any = require('./log/config/log4js.json') ?? {}
    private _controllerpath: string = "Controllers"
    private static controllers: Array<Controller> = []
    public static components: any = {}
    public static middlewares: any = {}


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
         * Model Register
         */

        this.loadModels();

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


    static get validate(): any {
        return this._validate;
    }

    static set validate(value: any) {
        this._validate = value;
    }

    app(config: any = {}): BaseChyz {

        /**
         * Config set
         */
        this.config = config;


        let components = Utils.findKeyValue(config, "components")
        if (components) {
            for (const componentsKey in components) {
                let comp = components[componentsKey];
                BaseChyz.logs().info("Create Component ", componentsKey)
                try {
                    BaseChyz.components[componentsKey] = Utils.createObject(new comp.class, comp);
                    BaseChyz.components[componentsKey]?.init();
                }catch (e) {
                    console.error(e)
                }

            }
        }


        let middlewares = Utils.findKeyValue(config, "middlewares")
        if (middlewares) {
            for (const middlewareKey in middlewares) {
                let middleware1 = middlewares[middlewareKey];
                BaseChyz.logs().debug("Create middlewares ", middlewareKey)
                BaseChyz.middlewares[middlewareKey] = middleware1;
                // BaseChyz.middlewares[middlewareKey] = Utils.createObject(new middleware1.class, middleware1);
            }
        }


        this.init();

        return this;
    }


    public logProvider() {
        return log4js;
    }

    public getLogger() {
        return this.logProvider().getLogger(this.constructor.name);
    }

    static logs(...args: any[]) {
        return log4js.getLogger(this.name);
    }

    public static trace(...args: any[]) {
        BaseChyz.logs().fatal(...arguments)
    }

    public static debug(...args: any[]) {
        BaseChyz.logs().debug(...arguments)
    }

    public static info(...args: any[]) {
        BaseChyz.logs().info(...arguments)
    }

    public static warn(...args: any[]) {
        BaseChyz.logs().warn(...arguments)
    }

    public static error(...args: any[]) {
        BaseChyz.logs().error(...arguments)
    }

    public static fatal(...args: any[]) {
        BaseChyz.logs().fatal(...arguments)
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
            res.status(408).json(error)
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


    public static getMiddlewares(key: any) {
        return BaseChyz.middlewares[key] ?? null
    }

    /**
     * load model
     */
    async loadModels() {
        let models: any = {}
        let path = `${this._controllerpath}/../Models`;
        fs.readdirSync(path).forEach((file: string) => {
            if (file !== "index.ts") {
                let model = require(`${path}/${file}`);
                // @ts-ignore
                let className = file.split(".")[0] + "Class";
                if (model[className])
                    models[className.replace("Class","")] = new model[className];
            }
        })

        ModelManager._register(models);

        for (const key of Object.keys(ModelManager)) {
            if(key!="_register"){
                ModelManager[key].init();
            }
        }
    }

    /**
     * load contoller
     */
    async loadController() {
        let articlesEndpoints: string[] = [];
        fs.readdirSync(`${this._controllerpath}/`).forEach((file: string) => {
            let controller = require(`${this._controllerpath}/${file}`);

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
                                BaseChyz.debug(`Call Request id ${instance.id}`)
                                await instance.beforeAction(route, req, res)
                                next()
                            } catch (e) {
                                BaseChyz.error(e);

                                res.status(e.statusCode || 500)
                                res.json({error: {code: e.statusCode || 500, name: e.name, message: e.message}})
                                // next(e)
                            }

                        },
                        async (req: Request, res: Response, next: NextFunction) => {
                            try {
                                // @ts-ignore
                                BaseChyz.debug("Request ID ", req.reqId)
                                // @ts-ignore
                                await instance[route.methodName](req, res, next);
                                instance.afterAction(route, req, res);
                            } catch (e) {
                                if (e instanceof Error) {
                                    BaseChyz.error(e)

                                    // @ts-ignore
                                    res.status(e.statusCode || 500)
                                    // @ts-ignore
                                    res.json({error: {code: e.statusCode || 500, name: e.name, message: e.message}})
                                } else {
                                    res.json(e)
                                }
                            }
                        })


                });
            }
        })
    }

    public middleware() {

        BaseChyz.express.use(bodyParser.json())
        BaseChyz.express.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
        BaseChyz.express.use(methodOverride());
        BaseChyz.express.use(methodOverride());


        // CORS
        BaseChyz.express.use(function (req: any, res: Response, next: any) {
            // @ts-ignore
            req.reqId = Utils.uniqueId("chyzzzz_")
            res.setHeader('Content-Type', 'application/json');
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
            next();
        });

        //Middlewares
        for (const middleware1 of Object.keys(BaseChyz.middlewares)) {
            if (!Utils.isFunction(middleware1)) {
                let keycloak = BaseChyz.middlewares[middleware1].keycloak;
                BaseChyz.express.use(keycloak.middleware(BaseChyz.middlewares[middleware1].config));
            } else {
                BaseChyz.express.use(BaseChyz.middlewares[middleware1]);
            }

        }


        BaseChyz.express.use(this.errorResponder)
        BaseChyz.express.use(this.errorHandler)
    }


    public Start() {

        BaseChyz.info("Express Server Starting")
        BaseChyz.express.listen(this._port, () => {
            BaseChyz.info("Express Server Start ")
            BaseChyz.info(`Liten Port ${this._port}`)
            BaseChyz.info(`http://localhost:${this._port}`)
            BaseChyz.info(`http://${ip.address()}:${this._port}`)
        })
        return this;
    }


}
