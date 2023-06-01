/**
 * https server
 */

import "reflect-metadata";
/**
 * Freamwork
 */
import {CWebController, DbConnection, InvalidConfigException, ModelManager} from "./base";
import {Utils} from "./requiments/Utils";
import {Logs} from "./base/Logs";
import {CEvents} from "./base/CEvents";
import calendar from "dayjs/plugin/calendar";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isTomorrow from "dayjs/plugin/isTomorrow";
import {AuthManager} from "./rbac/AuthManager";
import {WebUser} from "./web/WebUser";
import {IdentityInterface} from "./web/IdentityInterface";
import {ProviderInterface} from "./provider/ProviderInterface";
import fs = require("fs");
import {RouteDefinition} from "./model/RouteDefinition";

const emitter = require('events').EventEmitter;
const em = new emitter();

// /**
//  * set request id
//  */
// Object.defineProperty(Server.request, 'reqId', {
//     configurable: true,
//     enumerable: true,
//     writable: true
// })
// Object.defineProperty(Server.request, 'user', {
//     configurable: true,
//     enumerable: true,
//     writable: true
// })
// Object.defineProperty(Server.request, 'identity', {
//     configurable: true,
//     enumerable: true,
//     writable: true
// })


const validate = require('validate.js');
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const relative = require('dayjs/plugin/relativeTime')

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
        var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
        return dayjs().utc(value).format(format);
    }
});

export interface BaseChyzConfig {

    controllerPath: string;
    logs?: string;
    provider?: {
        class: any,
        config?: {
            port?: number
        };
    },
    components?: any & {
        db?: {
            class: DbConnection,
            database: string,
            username: string,
            password: string,
            options?: any
        },
        authManager?: {
            class: AuthManager
        },
        user: {
            class: WebUser,
            identityClass: IdentityInterface
        }
    };
    staticFilePath?: string
}


export default class BaseChyz {
    static initalized: boolean;
    private config: BaseChyzConfig | any;
    // static httpServer: any;
    static provider: any;
    // private _port: number = 3001;
    // static db: any;
    // static date: any = dayjs;
    // static routes: any;
    static logs: Logs = new Logs();
    private static _validate: any = validate;
    // private _controllerPath: string = "Controllers"
    static controllers: Array<CWebController> = []
    public static components: any = {}
    // public static middlewares: any = {}
    private static _EventEmitter: any = em


    static get EventEmitter(): any {
        return this._EventEmitter;
    }

    static set EventEmitter(value: any) {
        this._EventEmitter = value;
    }


    /**
     *
     */
    init() {

        /**
         * Model Register
         */

        this.loadModels();

        /**
         * Load Controller
         */
        this.loadController()


        BaseChyz.debug("Controller load success")
        BaseChyz.provider.init();
        BaseChyz.initalized = true;
    }

    app(config: BaseChyzConfig): BaseChyz {

        BaseChyz.EventEmitter.emit(CEvents.ON_INIT_BEFORE, this, config)

        /**
         * Config set
         */
        this.config = config;
        /**
         * provider ayarla
         */
        if (this.config.provider) {
            BaseChyz.provider = <ProviderInterface>Utils.createObject(new this.config.provider.class, this.config.provider);
        }


        /**
         * log setting
         */
        if (this.config.logs instanceof Logs) {
            BaseChyz.logs = this.config.logs;
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


        this.init();
        BaseChyz.initalized=true
        BaseChyz.EventEmitter.emit(CEvents.ON_INIT_AFTER, this, config)


        return this;
    }


    static get validate(): any {
        return this._validate;
    }

    static set validate(value: any) {
        this._validate = value;
    }


    public static trace(...args: any[]) {
        BaseChyz.logs.fatal(...args)
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

    //
    // public static getMiddlewares(key: any) {
    //     return BaseChyz.middlewares[key] ?? null
    // }

    /**
     * load model
     */
    async loadModels() {
        let models: any = {}
        try {
            let path = `${this.config.controllerPath}/../Models`;
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
        } catch (e) {
            BaseChyz.error("Models folder not found")
        }


        for (const key of Object.keys(ModelManager)) {
            if (key != "_register") {
                ModelManager[key].init();
            }
        }
    }

    /**
     * load contoller
     */
    loadController() {
        // let articlesEndpoints: string[] = [];
        BaseChyz.info("Load Controller ")
        for (const file of fs.readdirSync(`${this.config.controllerPath}/`)) {

            let controller = require(`${this.config.controllerPath}/${file}`);
            // let controller = (await import(`${this.config.controllerPath}/${file}`));
            if (controller[file.replace(".ts", "")]) {
                controller = controller[file.replace(".ts", "")]
            } else if (controller.default) {
                controller = controller.default;
            } else {
                throw new InvalidConfigException(BaseChyz.t("Invalid Controller"))
            }

            // This is our instantiated class
            const instance: CWebController = new controller();
            const prefix = Reflect.getMetadata('prefix', controller);
            const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);
            instance.prefix = prefix;
            instance.routes = routes;

            BaseChyz.controllers.push(instance);

        }
    }


    public Start() {
        let c = setInterval(() => {
            if (BaseChyz.initalized) {
                BaseChyz.EventEmitter.emit(CEvents.ON_BEFORE_START, this)
                BaseChyz.info("Express Server Starting")
                console.log("Canlandırıldı")
                BaseChyz.provider.Start()
                clearTimeout(c);
            }
        }, 100)

        return this;
    }

    public moduleIsAvailable(path: string) {
        try {
            require.resolve(path);
            return true;
        } catch (e) {
            return false;
        }
    }
}
