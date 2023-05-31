/*
 *
 * Copyright (c) 2023.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */


import {ProviderInterface} from "./ProviderInterface";
import {createServer as httpsCreate} from "https";


import {createServer as httpCreate} from "http";
import {CEvents, CWebController, InvalidConfigException} from "../base";
import ip from "ip";
import express, {NextFunction, Request, Response} from "express";
import BaseChyz from "../BaseChyz";
import methodOverride from "method-override";
import bodyParser = require('body-parser');
import fs = require("fs");
const Server = express();
const cors = require('cors');
const emitter = require('events').EventEmitter;
const em = new emitter();

const http_request = require('debug')('http:request')
const http_request_body = http_request.extend('body')
const http_request_headers = http_request.extend('headers')
const compression = require('compression')

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


interface BaseChyzConfig {
    port: string;
    logs: string;
    components: string;
    staticFilePath?: string
}

export class ExpressServer implements ProviderInterface {
    private config: BaseChyzConfig | any;
    init(configs: any): void {
        this.config = configs
    }

    Start(): void {
        if (this.config?.ssl) {
            BaseChyz.httpServer = httpsCreate(this.config?.ssl, Server);
            BaseChyz.httpServer.listen(this.config, () => {
                BaseChyz.info("Express Server Start ")
                BaseChyz.info(`Liten Port ${this.config}`)
                BaseChyz.info(`https://localhost:${this.config}`)
                BaseChyz.info(`https://${ip.address()}:${this.config}`)
                BaseChyz.EventEmitter.emit(CEvents.ON_START, this)
            })
        } else {
            BaseChyz.httpServer = httpCreate(BaseChyz.propvider);
            BaseChyz.propvider.listen(this.config, () => {
                BaseChyz.info("Express Server Start ")
                BaseChyz.info(`Liten Port ${this.config}`)
                BaseChyz.info(`http://localhost:${this.config}`)
                BaseChyz.info(`http://${ip.address()}:${this.config}`)
                BaseChyz.EventEmitter.emit(CEvents.ON_START, this)
            })
        }
    }

    errorHandler(err: any, req: any, res: any, next: any): void {
    }

    errorResponder(error: any, req: any, res: any, next: any): void {
    }

    async loadController(): Promise<void> {
        for (const file of fs.readdirSync(`${this.config.controllerpath}/`)) {
            // let controller = require(`${this._controllerpath}/${file}`);
            let controller = (await import(`${this.config.controllerpath}/${file}`));
            if (controller[file.replace(".ts", "")]) {
                controller = controller[file.replace(".ts", "")]
            } else if (controller.default) {
                controller = controller.default;
            } else {
                throw new InvalidConfigException(BaseChyz.t("Invalid Controller"))
            }


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

                    let actionId = (route.path == "/" || route.path == "") ? instance.defaultAction : route.path;
                    route.id = actionId;
                    BaseChyz.debug("Controller route Path", prefix + (route.path.startsWith("/") ? route.path : `/${route.path}`))

                    BaseChyz.propvider[route.requestMethod](prefix + (route.path.startsWith("/") ? route.path : `/${route.path}`),
                        async (req: Request, res: Response, next: NextFunction) => {
                            try {
                                BaseChyz.debug(`Call Request id ${actionId}`)
                                http_request_body("Request body " + JSON.stringify(req.body))
                                http_request_headers("Request header " + JSON.stringify(req.headers))
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

    middleware(): void {

        BaseChyz.propvider.use(bodyParser.json({limit: '1mb'}));
        BaseChyz.propvider.use(bodyParser.urlencoded({limit: '1mb', extended: true})); // support encoded bodies
        BaseChyz.propvider.use(methodOverride());
        BaseChyz.propvider.use(cors());

    }


}
