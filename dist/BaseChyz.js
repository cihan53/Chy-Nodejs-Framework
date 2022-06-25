"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Utils_1 = __importDefault(require("./requiments/Utils"));
const base_1 = require("./base");
const https = require('https');
const express = require("express");
const log4js = require("log4js");
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
validate.validators.array = (arrayItems, itemConstraints) => {
    const arrayItemErrors = arrayItems.reduce((errors, item, index) => {
        const error = validate(item, itemConstraints);
        if (error)
            errors[index] = { error: error };
        return errors;
    }, {});
    return Utils_1.default.isEmpty(arrayItemErrors) ? null : { errors: arrayItemErrors };
};
validate.validators.tokenString = (items, itemConstraints) => {
    let arrayItems = items.split(",");
    const arrayItemErrors = arrayItems.reduce((errors, item, index) => {
        const error = validate(item, itemConstraints);
        if (error)
            errors[index] = { error: error };
        return errors;
    }, {});
    return Utils_1.default.isEmpty(arrayItemErrors) ? null : { errors: arrayItemErrors };
};
var ip = require('ip');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
class BaseChyz {
    constructor() {
        var _a;
        this._port = 3001;
        this._logConfig = (_a = require('./log/config/log4js.json')) !== null && _a !== void 0 ? _a : {};
        this._controllerpath = "Controllers";
    }
    get logConfig() {
        return this._logConfig;
    }
    set logConfig(value) {
        this._logConfig = value;
    }
    get controllerpath() {
        return this._controllerpath;
    }
    set controllerpath(value) {
        this._controllerpath = value;
    }
    init() {
        /**
         * set request id
         */
        Object.defineProperty(BaseChyz.express.request, 'reqId', {
            configurable: true,
            enumerable: true,
            writable: true
        });
        Object.defineProperty(BaseChyz.express.request, 'user', {
            configurable: true,
            enumerable: true,
            writable: true
        });
        Object.defineProperty(BaseChyz.express.request, 'identity', {
            configurable: true,
            enumerable: true,
            writable: true
        });
        /**
         * server port setting
         */
        if (this.config.hasOwnProperty("port"))
            this.port = this.config.port;
        /**
         * controller path
         */
        if (this.config.controllerpath) {
            this.controllerpath = this.config.controllerpath;
        }
        /**
         * Model Register
         */
        this.loadModels();
        /**
         * Express Server
         */
        this.middleware();
        /**
         * Load Controller
         */
        this.loadController();
    }
    /**
     * Listen port number
     * Server port number get
     */
    get port() {
        return this._port;
    }
    /**
     * Listen port number
     * Server port number setting
     * @param value
     */
    set port(value) {
        this._port = value;
    }
    static get validate() {
        return this._validate;
    }
    static set validate(value) {
        this._validate = value;
    }
    app(config = {}) {
        var _a;
        /**
         * Config set
         */
        this.config = config;
        // logger setting
        this.logProvider().level = log4js.levels.ALL;
        this.logProvider().configure(this._logConfig);
        let components = Utils_1.default.findKeyValue(config, "components");
        if (components) {
            for (const componentsKey in components) {
                let comp = components[componentsKey];
                BaseChyz.debug("Create Component ", componentsKey);
                try {
                    BaseChyz.components[componentsKey] = Utils_1.default.createObject(new comp.class, comp);
                    (_a = BaseChyz.components[componentsKey]) === null || _a === void 0 ? void 0 : _a.init();
                }
                catch (e) {
                    BaseChyz.error("Create Component Error", e);
                }
            }
        }
        let middlewares = Utils_1.default.findKeyValue(config, "middlewares");
        if (middlewares) {
            for (const middlewareKey in middlewares) {
                let middleware1 = middlewares[middlewareKey];
                BaseChyz.logs().debug("Create middlewares ", middlewareKey);
                BaseChyz.middlewares[middlewareKey] = middleware1;
                // BaseChyz.middlewares[middlewareKey] = Utils.createObject(new middleware1.class, middleware1);
            }
        }
        this.init();
        return this;
    }
    logProvider() {
        return log4js;
    }
    getLogger() {
        return this.logProvider().getLogger(this.constructor.name);
    }
    static logs(...args) {
        return log4js.getLogger(this.name);
    }
    static trace(...args) {
        BaseChyz.logs().fatal(...arguments);
    }
    static debug(...args) {
        BaseChyz.logs().debug(...arguments);
    }
    static info(...args) {
        BaseChyz.logs().info(...arguments);
    }
    static warn(...args) {
        BaseChyz.logs().warn(...arguments);
    }
    static error(...args) {
        BaseChyz.logs().error(...arguments);
    }
    static fatal(...args) {
        BaseChyz.logs().fatal(...arguments);
    }
    static warning(...args) {
        BaseChyz.logs().warn(...arguments);
    }
    static t(text) {
        return text;
    }
    errorLogger(error, req, res, next) {
        BaseChyz.error(error);
        next(error); // forward to next middleware
    }
    errorResponder(error, req, res, next) {
        if (error.type == 'redirect')
            res.redirect('/error');
        else if (error.type == 'time-out') // arbitrary condition check
            res.status(408).json(error);
        else
            next(error); // forwarding exceptional case to fail-safe middleware
    }
    errorHandler(err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).json({ error: err });
    }
    static getComponent(key) {
        var _a;
        return (_a = BaseChyz.components[key]) !== null && _a !== void 0 ? _a : null;
    }
    static getMiddlewares(key) {
        var _a;
        return (_a = BaseChyz.middlewares[key]) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * load model
     */
    loadModels() {
        return __awaiter(this, void 0, void 0, function* () {
            let models = {};
            let path = `${this._controllerpath}/../Models`;
            fs.readdirSync(path).forEach((file) => {
                if (file !== "index.ts") {
                    let model = require(`${path}/${file}`);
                    // @ts-ignore
                    let className = file.split(".")[0] + "Class";
                    if (model[className])
                        models[className.replace("Class", "")] = new model[className];
                }
            });
            base_1.ModelManager._register(models);
            for (const key of Object.keys(base_1.ModelManager)) {
                if (key != "_register") {
                    base_1.ModelManager[key].init();
                }
            }
        });
    }
    /**
     * load contoller
     */
    loadController() {
        return __awaiter(this, void 0, void 0, function* () {
            let articlesEndpoints = [];
            fs.readdirSync(`${this._controllerpath}/`).forEach((file) => {
                let controller = require(`${this._controllerpath}/${file}`);
                // This is our instantiated class
                const instance = new controller();
                BaseChyz.controllers.push(instance);
                // The prefix saved to our controller
                // @ts-ignore
                const prefix = Reflect.getMetadata('prefix', controller);
                // Our `routes` array containing all our routes for this controller
                // @ts-ignore
                const routes = Reflect.getMetadata('routes', controller);
                BaseChyz.logs().debug("Controller load ", controller.name, `(${prefix})`);
                if (routes) {
                    routes.forEach(route => {
                        let actionId = route.path == "/" || route.path == "" ? instance.defaultAction : route.path;
                        route.id = actionId;
                        BaseChyz.logs().debug("Controller route Path", prefix + (route.path.startsWith("/") ? route.path : `/${route.path}`));
                        BaseChyz.express[route.requestMethod](prefix + (route.path.startsWith("/") ? route.path : `/${route.path}`), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                            try {
                                BaseChyz.debug(`Call Request id ${instance.id}`);
                                yield instance.beforeAction(route, req, res);
                                next();
                            }
                            catch (e) {
                                BaseChyz.error(e);
                                res.status(e.statusCode || 500);
                                res.json({ error: { code: e.statusCode || 500, name: e.name, message: e.message } });
                                // next(e)
                            }
                        }), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                            try {
                                // @ts-ignore
                                BaseChyz.debug("Request ID ", req.reqId);
                                // @ts-ignore
                                yield instance[route.methodName](req, res, next);
                                instance.afterAction(route, req, res);
                            }
                            catch (e) {
                                if (e instanceof Error) {
                                    BaseChyz.error(e);
                                    // @ts-ignore
                                    res.status(e.statusCode || 500);
                                    // @ts-ignore
                                    res.json({ error: { code: e.statusCode || 500, name: e.name, message: e.message } });
                                }
                                else {
                                    res.json(e);
                                }
                            }
                        }));
                    });
                }
            });
        });
    }
    middleware() {
        BaseChyz.express.use(bodyParser.json({ limit: '1mb' }));
        BaseChyz.express.use(bodyParser.urlencoded({ limit: '1mb', extended: true })); // support encoded bodies
        BaseChyz.express.use(methodOverride());
        BaseChyz.express.use(methodOverride());
        // CORS
        BaseChyz.express.use(function (req, res, next) {
            // @ts-ignore
            req.reqId = Utils_1.default.uniqueId("chyzzzz_");
            res.setHeader('Content-Type', 'application/json');
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
            next();
        });
        //Middlewares
        for (const middleware1 of Object.keys(BaseChyz.middlewares)) {
            if (!Utils_1.default.isFunction(middleware1)) {
                let keycloak = BaseChyz.middlewares[middleware1].keycloak;
                BaseChyz.express.use(keycloak.middleware(BaseChyz.middlewares[middleware1].config));
            }
            else {
                BaseChyz.express.use(BaseChyz.middlewares[middleware1]);
            }
        }
        BaseChyz.express.use(this.errorResponder);
        BaseChyz.express.use(this.errorHandler);
    }
    Start() {
        var _a, _b;
        BaseChyz.info("Express Server Starting");
        if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.ssl) {
            BaseChyz.httpServer = https.createServer((_b = this.config) === null || _b === void 0 ? void 0 : _b.ssl, BaseChyz.express);
            BaseChyz.httpServer.listen(this._port, () => {
                BaseChyz.info("Express Server Start ");
                BaseChyz.info(`Liten Port ${this._port}`);
                BaseChyz.info(`https://localhost:${this._port}`);
                BaseChyz.info(`https://${ip.address()}:${this._port}`);
            });
        }
        else {
            BaseChyz.httpServer = BaseChyz.express.listen(this._port, () => {
                BaseChyz.info("Express Server Start ");
                BaseChyz.info(`Liten Port ${this._port}`);
                BaseChyz.info(`http://localhost:${this._port}`);
                BaseChyz.info(`http://${ip.address()}:${this._port}`);
            });
        }
        return this;
    }
}
exports.default = BaseChyz;
BaseChyz.express = express();
BaseChyz._validate = validate;
BaseChyz.controllers = [];
BaseChyz.components = {};
BaseChyz.middlewares = {};
//# sourceMappingURL=BaseChyz.js.map