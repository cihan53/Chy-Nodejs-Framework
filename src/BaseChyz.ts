import {Request, Response, NextFunction} from "express";
import {CWebController, ModelManager} from "./base";

import Utils from "./requiments/Utils";
import {Logs} from "./base/Logs";


const https = require('https');
const express = require("express");
const compression = require('compression')

const fs = require('fs');
const validate = require('validate.js');

/**
 * Use
 *  selectedBox: {
 *     array: {
 *        id: {
 *          numericality: {
 *            onlyInteger: true,
 *            greaterThan: 0
 *          }
 *       }
 *      }
 *    },
 * @param arrayItems
 * @param itemConstraints
 */
validate.validators.array = (arrayItems: any, itemConstraints: any) => {
    const arrayItemErrors = arrayItems.reduce((errors: any, item: any, index: any) => {
        const error = validate(item, itemConstraints);
        if (error) errors[index] = {error: error};
        return errors;
    }, {});

    return Utils.isEmpty(arrayItemErrors) ? null : {errors: arrayItemErrors};
};


validate.validators.tokenString = (items: any, itemConstraints: any) => {
    let arrayItems = items.split(",");
    const arrayItemErrors = arrayItems.reduce((errors: any, item: any, index: any) => {
        const error = validate(item, itemConstraints);
        if (error) errors[index] = {error: error};
        return errors;
    }, {});

    return Utils.isEmpty(arrayItemErrors) ? null : {errors: arrayItemErrors};
};

const ip = require('ip');
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Server = express();

/**
 * set request id
 */
Object.defineProperty(Server.request, 'reqId', {
    configurable: true,
    enumerable: true,
    writable: true
})
Object.defineProperty(Server.request, 'user', {
    configurable: true,
    enumerable: true,
    writable: true
})
Object.defineProperty(Server.request, 'identity', {
    configurable: true,
    enumerable: true,
    writable: true
})


export default class BaseChyz {
    private config: any;
    static app: string;
    static httpServer: any;
    static express = Server
    private _port: number = 3001;
    static db: any;
    static routes: any;
    static logs: Logs = new Logs();
    private static _validate: any = validate;
    private _controllerpath: string = "Controllers"
    private static controllers: Array<CWebController> = []
    public static components: any = {}
    public static middlewares: any = {}



    get controllerpath(): string {
        return this._controllerpath;
    }

    set controllerpath(value: string) {
        this._controllerpath = value;
    }

    init() {


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


        /**
         * log setting
         */
        if (this.config.logs instanceof Logs) {
            BaseChyz.logs = this.config.logs;
        }

        // logger setting
        // this.logProvider().level = log4js.levels.ALL;
        // this.logProvider().configure(this._logConfig);

        let components = Utils.findKeyValue(config, "components")
        if (components) {
            for (const componentsKey in components) {

                let comp = components[componentsKey];
                BaseChyz.debug("Create Component ", componentsKey)
                try {
                    BaseChyz.components[componentsKey] = Utils.createObject(new comp.class, comp);
                    BaseChyz.components[componentsKey]?.init();
                } catch (e) {
                    BaseChyz.error("Create Component Error", e)
                }

            }
        }


        let middlewares = Utils.findKeyValue(config, "middlewares")
        if (middlewares) {
            for (const middlewareKey in middlewares) {
                let middleware1 = middlewares[middlewareKey];
                BaseChyz.debug("Create middlewares ", middlewareKey)
                BaseChyz.middlewares[middlewareKey] = middleware1;
                // BaseChyz.middlewares[middlewareKey] = Utils.createObject(new middleware1.class, middleware1);
            }
        }

        this.init();

        return this;
    }


    public static trace(...args: any[]) {
        BaseChyz.logs.fatal(...arguments)
    }

    public static debug(...args: any[]) {
        BaseChyz.logs.debug(...arguments)
    }

    public static info(...args: any[]) {
        BaseChyz.logs.info(...arguments)
    }

    public static warn(...args: any[]) {
        BaseChyz.logs.warn(...arguments)
    }

    public static error(...args: any[]) {
        BaseChyz.logs.error(...arguments)
    }

    public static fatal(...args: any[]) {
        BaseChyz.logs.fatal(...arguments)
    }


    public static warning(...args: any[]) {
        BaseChyz.logs.warn(...arguments)
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

        res.status(500).json({error: err})
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
                    models[className.replace("Class", "")] = new model[className];
            }
        })

        /**
         *
         */
        ModelManager._register(models);

        for (const key of Object.keys(ModelManager)) {
            if (key != "_register") {
                ModelManager[key].init();
            }
        }
    }

    /**
     * load contoller
     */
    async loadController() {
        // let articlesEndpoints: string[] = [];
        for (const file of fs.readdirSync(`${this._controllerpath}/`)) {
            // let controller = require(`${this._controllerpath}/${file}`);
            let controller = (await import(`${this._controllerpath}/${file}`))[file.replace(".ts", "")];
            // This is our instantiated class
            const instance: CWebController = new controller();

            BaseChyz.controllers.push(instance);

            // The prefix saved to our controller
            // @ts-ignore
            const prefix = Reflect.getMetadata('prefix', controller);
            // Our `routes` array containing all our routes for this controller
            // @ts-ignore
            const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);
            BaseChyz.debug("Controller load ", controller.name, `(${prefix})`)

            if (routes) {
                routes.forEach(route => {

                    let actionId = route.path == "/" || route.path == "" ? instance.defaultAction : route.path;
                    route.id = actionId;
                    BaseChyz.debug("Controller route Path", prefix + (route.path.startsWith("/") ? route.path : `/${route.path}`))

                    BaseChyz.express[route.requestMethod](prefix + (route.path.startsWith("/") ? route.path : `/${route.path}`),
                        async (req: Request, res: Response, next: NextFunction) => {
                            try {
                                BaseChyz.debug(`Call Request id ${instance.id}`)
                                await instance.beforeAction(route, req, res)
                                next()
                            } catch (e: any) {
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
        }
    }

    public middleware() {

        BaseChyz.express.use(bodyParser.json({limit: '1mb'}));
        BaseChyz.express.use(bodyParser.urlencoded({limit: '1mb', extended: true})); // support encoded bodies
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

        // compress all responses
        BaseChyz.express.use(compression())

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

        if (this.config?.ssl) {
            BaseChyz.httpServer = https.createServer(this.config?.ssl, BaseChyz.express);
            BaseChyz.httpServer.listen(this._port, () => {
                BaseChyz.info("Express Server Start ")
                BaseChyz.info(`Liten Port ${this._port}`)
                BaseChyz.info(`https://localhost:${this._port}`)
                BaseChyz.info(`https://${ip.address()}:${this._port}`)
            })
        } else {
            BaseChyz.httpServer = BaseChyz.express.listen(this._port, () => {
                BaseChyz.info("Express Server Start ")
                BaseChyz.info(`Liten Port ${this._port}`)
                BaseChyz.info(`http://localhost:${this._port}`)
                BaseChyz.info(`http://${ip.address()}:${this._port}`)
            })
        }


        return this;
    }
}
