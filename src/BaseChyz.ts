/**
 * https server
 */
import express, {NextFunction, Request, Response} from "express";
import {createServer as httpsCreate} from "https";
import {createServer as httpCreate} from "http";

/**
 * Freamwork
 */
import {BaseError, CEvents, CWebController, InvalidConfigException, Logs, ModelManager} from "./base";
import {Utils} from "./requiments/Utils";
import calendar from "dayjs/plugin/calendar";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isTomorrow from "dayjs/plugin/isTomorrow";
import {RouteDefinition} from "./model/RouteDefinition";
import bodyParser = require('body-parser');
import fs = require("fs");


// const http_request = require('debug')('http:request')
// const http_request_body = http_request.extend('body')
// const http_request_headers = http_request.extend('headers')
import compression from 'compression';

// const fs = require('fs');


import ip from 'ip';
import cors from 'cors';

import methodOverride from 'method-override';
const Server = express();
const emitter = require('events').EventEmitter;
const em = new emitter();

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


import validate from 'validate.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relative from 'dayjs/plugin/relativeTime';

dayjs.extend(utc)
dayjs.extend(relative)
dayjs.extend(isTomorrow);
dayjs.extend(calendar);
dayjs.extend(weekOfYear);

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
    if (!Utils.isArray(arrayItems)) return {errors: [{error: 'in not array'}]};
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


validate.extend(validate.validators.datetime, {
    // The value is guaranteed not to be null or undefined but otherwise it
    // could be anything.
    parse: function (value: any, options: any) {
        return +dayjs().utc(value);
    },
    // Input is a unix timestamp
    format: function (value: any, options: any) {
        const format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
        return dayjs().utc(value).format(format);
    }
});

interface BaseChyzConfig {
    port: string;
    logs: string;
    components: string;
    staticFilePath?: string
}


export default class BaseChyz {
    private config: BaseChyzConfig | any;
    static httpServer: any;
    static propvider: any = Server
    private _port: number = 3001;
    static db: any;
    static date: any = dayjs;
    static routes: any;
    static logs: Logs = new Logs();
    private static _validate: any = validate;
    private _controllerpath: string = "Controllers"
    private static controllers: Array<CWebController> = []
    public static components: any = {}
    public static middlewares: any = {}
    private static _EventEmitter: any = em


    static get EventEmitter(): any {
        return this._EventEmitter;
    }

    static set EventEmitter(value: any) {
        this._EventEmitter = value;
    }

    get controllerpath(): string {
        return this._controllerpath;
    }

    set controllerpath(value: string) {
        this._controllerpath = value;
    }

    /**
     *
     */
    async init() {

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
        await this.loadController();


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

    async app(config: any = {}): Promise<BaseChyz> {

        BaseChyz.EventEmitter.emit(CEvents.ON_INIT_BEFORE, this, config)

        /**
         * Config set
         */
        this.config = config;


        /**
         * log setting
         */
        if (this.config.logs instanceof Logs) {
            BaseChyz.logs = this.config.logs;
        } else if (!this.config.hasOwnProperty('logs')) {
            BaseChyz.logs = new Logs();
        }


        let components = Utils.findKeyValue(config, "components")
        if (components) {

            /**
             * first initial database component
             */
            if (components.db) {
                let comp = components['db'];
                BaseChyz.debug("First initial database component ", "db")
                try {
                    BaseChyz.components["db"] = Utils.createObject(new comp.class, comp);
                    BaseChyz.components["db"]?.init();
                    delete components.db
                } catch (e) {
                    BaseChyz.error("Create Component Error", e)
                }
            }

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

        await this.init();

        BaseChyz.EventEmitter.emit(CEvents.ON_INIT_AFTER, this, config)
        return this;
    }


    public static trace(...args: any[]) {
        BaseChyz.logs.fatal(...arguments)
    }

    public static debug(...args: any[]) {
        BaseChyz.logs.debug(...args)
    }

    public static info(...args: any[]) {
        BaseChyz.logs.info(...args)
    }

    public static warn(...args: any[]) {
        BaseChyz.logs.warn(...args)
    }

    public static error(...args: any[]) {
        BaseChyz.logs.error(...args)
    }

    public static fatal(...args: any[]) {
        BaseChyz.logs.fatal(...args)
    }


    public static warning(...args: any[]) {
        BaseChyz.logs.warn(...args)
    }

    public static t(text: string, params?: any) {
        if (text == "") return;

        // let lang = require("@root/locales/tr/translation.json");
        let lang: any = {};
        if (lang.hasOwnProperty(text)) {
            text = lang[text];
        }

        return text.tokenReplace(params);
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
    loadModels() {
        let models: any = {}
        let path = `${this._controllerpath}/../Models`;
        if (fs.existsSync(path)) {
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
        }else{
            BaseChyz.error("Model folder not found");
        }
    }


    async beforeMiddleware(req: Request, res: Response, next: NextFunction, instance: CWebController, route: RouteDefinition) {
        BaseChyz.debug(`${instance.id}/${route.path}->beforeMiddleware trigger`);
        // http_request_body("Request body " + JSON.stringify(req.body))
        // http_request_headers("Request header " + JSON.stringify(req.headers))
        try {
            await instance.beforeAction(route, req, res)
            next();
        } catch (e) {
            BaseChyz.error(e)
            if (e instanceof BaseError) {
                res.status(e?.statusCode || 500)
                res.json(e.toJSON())
            } else {
                res.json(e)
            }

        }

    }

    async responseHandler(req: Request, res: Response, next: NextFunction, instance: CWebController, route: RouteDefinition) {
        BaseChyz.debug(`${instance.id}/${route.path}->responseHandler trigger`);
        try {
            // @ts-ignore
            await instance[route.methodName](req, res, next);
            next();
        } catch (e) {
            BaseChyz.error(e)
            if (e instanceof BaseError) {
                res.status(e?.statusCode || 500)
                res.json(e.toJSON())
            } else {
                res.json(e)
            }
        }

    }

    async afterMiddleware(req: Request, res: Response, next: NextFunction, instance: CWebController, route: RouteDefinition) {
        BaseChyz.debug(`${instance.id}/${route.path}->afterMiddleware trigger`);
        try {
            await instance.afterAction(route, req, res);
        } catch (e) {
            BaseChyz.error(e)
            if (e instanceof BaseError) {
                res.status(e?.statusCode || 500)
                res.json(e.toJSON())
            } else {
                res.json(e)
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
            let controller = (await import(`${this._controllerpath}/${file}`));
            if (controller[file.replace(".ts", "")]) {
                controller = controller[file.replace(".ts", "")]
            } else if (controller.default) {
                controller = controller.default;
            } else {
                throw new InvalidConfigException(BaseChyz.t(`Invalid Controller ${file}`))
            }


            // This is our instantiated class
            const instance: CWebController = new controller();

            BaseChyz.controllers.push(instance);

            // The prefix saved to our controller
            const prefix = Reflect.getMetadata('prefix', controller);
            // Our `routes` array containing all our routes for this controller
            const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);
            BaseChyz.debug("Controller load ", controller.name, `(${prefix})`)

            if (routes) {
                routes.forEach(route => {
                    route.id = (route.path == "/" || route.path == "") ? instance.defaultAction : route.path;
                    BaseChyz.debug("Controller route Path", prefix + (route.path.startsWith("/") ? route.path : `/${route.path}`))
                    BaseChyz.propvider[route.requestMethod](prefix + (route.path.startsWith("/") ? route.path : `/${route.path}`),
                        (req: Request, res: Response, next: NextFunction) => this.beforeMiddleware(req, res, next, instance, route),
                        (req: Request, res: Response, next: NextFunction) => this.responseHandler(req, res, next, instance, route),
                        (req: Request, res: Response, next: NextFunction) => this.afterMiddleware(req, res, next, instance, route),
                    );
                    // BaseChyz.propvider[route.requestMethod](prefix + (route.path.startsWith("/") ? route.path : `/${route.path}`),
                    //     async (req: Request, res: Response, next: NextFunction) => {
                    //         try {
                    //             BaseChyz.debug(`Call Request id ${actionId}`)
                    //             http_request_body("Request body " + JSON.stringify(req.body))
                    //             http_request_headers("Request header " + JSON.stringify(req.headers))
                    //             await instance.beforeAction(route, req, res);
                    //             next()
                    //         } catch (e: any) {
                    //
                    //             BaseChyz.error(e)
                    //             if (e instanceof BaseError) {
                    //                 res.status(e?.statusCode || 500)
                    //                 res.json(e.toJSON())
                    //             } else {
                    //                 res.json(e)
                    //             }
                    //
                    //             // / next(e)
                    //         }
                    //
                    //     },
                    //     async (req: Request, res: Response, next: NextFunction) => {
                    //         try {
                    //             // @ts-ignore
                    //             BaseChyz.debug("Request ID ", req.reqId)
                    //             // @ts-ignore
                    //             await instance[route.methodName](req, res, next);
                    //             instance.afterAction(route, req, res);
                    //         } catch (e) {
                    //             BaseChyz.error(e)
                    //             if (e instanceof BaseError) {
                    //                 res.status(e.statusCode || 500)
                    //                 res.json(e.toJSON())
                    //             } else {
                    //                 res.json(e)
                    //             }
                    //         }
                    //     })
                });
            }
        }
    }

    public middleware() {

        BaseChyz.propvider.use(bodyParser.json({limit: '1mb'}));
        BaseChyz.propvider.use(bodyParser.urlencoded({limit: '1mb', extended: true})); // support encoded bodies
        BaseChyz.propvider.use(methodOverride());
        BaseChyz.propvider.use(cors());
        //
        // // CORS
        // BaseChyz.express.use(function (req: any, res: Response, next: any) {
        //     // @ts-ignore
        //     req.reqId = Utils.uniqueId("chyzzzz_")
        //     res.setHeader('Content-Type', 'application/json');
        //     res.setHeader("Access-Control-Allow-Origin", "*");
        //     res.setHeader("Access-Control-Allow-Credentials", "true");
        //     res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        //     res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
        //     next();
        // });
        //
        // compress all responses
        const shouldCompress = (req: Request, res: Response): boolean => {
            // don't compress responses explicitly asking not
            if (req.headers["x-no-compression"] || res.getHeader('Content-Type') === 'text/event-stream') {
                return false;
            }

            // use compression filter function
            return compression.filter(req, res);
        };
        BaseChyz.propvider.use(compression({filter: shouldCompress}))
        //
        // //static file path
        if (this.config.staticFilePath) {
            BaseChyz.info('Static file path', this.config.staticFilePath)
            BaseChyz.propvider.use(express.static(this.config.staticFilePath))
        }


        //Middlewares
        for (const middleware1 of Object.keys(BaseChyz.middlewares)) {
            if (BaseChyz.middlewares[middleware1]?.keycloak) {
                let keycloak = BaseChyz.middlewares[middleware1].keycloak;
                //@ts-ignore
                BaseChyz.propvider.use(keycloak.middleware(BaseChyz.middlewares[middleware1].config));
            } else {
                BaseChyz.propvider.use(BaseChyz.middlewares[middleware1]);
            }

        }


        BaseChyz.propvider.use(this.errorResponder)
        BaseChyz.propvider.use(this.errorHandler)

        BaseChyz.EventEmitter.emit(CEvents.ON_MIDDLEWARE, this)
    }

    public Start() {

        BaseChyz.info("Express Server Starting")
        BaseChyz.EventEmitter.emit(CEvents.ON_BEFORE_START, this)
        if (this.config?.ssl) {
            BaseChyz.httpServer = httpsCreate(this.config?.ssl, BaseChyz.propvider);
            BaseChyz.httpServer.listen(this._port, () => {
                BaseChyz.info("Express Server Start ")
                BaseChyz.info(`Liten Port ${this._port}`)
                BaseChyz.info(`https://localhost:${this._port}`)
                BaseChyz.info(`https://${ip.address()}:${this._port}`)
                BaseChyz.EventEmitter.emit(CEvents.ON_START, this)
            })
        } else {
            BaseChyz.httpServer = httpCreate(BaseChyz.propvider);
            BaseChyz.propvider.listen(this._port, () => {
                BaseChyz.info("Express Server Start ")
                BaseChyz.info(`Liten Port ${this._port}`)
                BaseChyz.info(`http://localhost:${this._port}`)
                BaseChyz.info(`http://${ip.address()}:${this._port}`)
                BaseChyz.EventEmitter.emit(CEvents.ON_START, this)
            })
        }


        return this;
    }
}
