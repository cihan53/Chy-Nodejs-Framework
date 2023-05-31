/*
 *
 * Copyright (c) 2023.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */


import BaseChyz, {BaseChyzConfig} from "../BaseChyz";
import {ProviderInterface} from "./ProviderInterface";
import {CEvents, Component} from "../base";


import Fastify from 'fastify';
import {controller} from "../decorator";
import {RouteDefinition} from "../model/RouteDefinition";


export class FastifyServer extends Component implements ProviderInterface {
    public config: BaseChyzConfig | any;
    private provider: any;

    public init(): void {
        this.provider = Fastify({
            logger: true,
            disableRequestLogging: true,
        });

        /**
         * controller install
         */
        this.loadController();
    }

    public Start(): void {

        let obj = this

        obj.provider.listen({port: this.config.port}, function (err: any, address: any) {
            if (err) {
                obj.provider.log.error(err)
                process.exit(1)
            }
            BaseChyz.info(`server listening on ${address}`)
            BaseChyz.EventEmitter.emit(CEvents.ON_START, obj)
        })

    }

    errorHandler(err: any, req: any, res: any, next: any): void {
    }

    errorResponder(error: any, req: any, res: any, next: any): void {
    }

    async loadController(): Promise<void> {

        for (const controller of BaseChyz.controllers) {
            console.log(controller)
            // this.provider.route({
            //
            // })
            const prefix = Reflect.getMetadata('prefix', controller);
            const ct = Reflect.getMetadata('controller', controller);
            const pr = Reflect.getMetadata('controller', controller,"method");
            const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);
            console.log(pr, "reflect")
            console.log(ct, "reflect")
            console.log(routes, "reflect")
        }

        this.provider.route({
            method: 'GET',
            url: '/',
            schema: {
                querystring: {
                    name: {type: 'string'},
                    excitement: {type: 'integer'}
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            hello: {type: 'string'}
                        }
                    }
                }
            },
            handler: function (request: any, reply: any) {
                reply.send({hello: 'world'})
            }
        })
    }

    middleware(): void {
        this.provider.use(require('cors')())
    }
}
