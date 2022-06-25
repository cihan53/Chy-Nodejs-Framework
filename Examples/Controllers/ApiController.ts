/*
 *
 * Copyright (c) 2021-2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

import {CWebController, ForbiddenHttpException, ModelManager, ValidationHttpException} from "../../base";
import BaseChyz from "../../BaseChyz";
// @ts-ignore
import {Request, Response} from "express";
import {controller, get, post} from "../../decorator";
import {JwtHttpBearerAuth} from "../../filters/auth";


@controller("/api")
class ApiController extends CWebController {

    public myCheck(token) {
        console.log("myyyyyyyyyyyyyyyyyyyyy")
    }

    public behaviors(): any[] {

        return [{
            'authenticator': {
                "class": JwtHttpBearerAuth,
                // "auth": this.myCheck
            },
            // 'access': {
            //     'class': AccessControl,
            //     'only': ['order/list' ],
            //     'rules': [
            //
            //         {
            //             'allow': true,
            //             'actions': ['order/list' ],
            //             'roles': ['edis-manager'],
            //         }
            //     ]
            // }
        }]
    }

    @get("/")
    Index(req: Request, res: Response) {

        BaseChyz.logs().info("Site Controller Burası", this.id)
        return res.json({message: "index sayfası"})
    }

    @post("orderCreate")
    async Login(req: Request, res: Response) {
        let data = req.body;
        data.Customer.status = "true";
        data.Customer["2fa"] = "true";

        //Customer Model Create
        let customer = ModelManager.Customer.save();
        //Order Model Create
        let order = ModelManager.Order;


        let transaction
        try {
            // get transaction
            transaction = await BaseChyz.getComponent("db").transaction();
            customer.load(data, "Customer");//load customer data
            let cus: any = await customer.save({}, {transaction});

            if (!cus) {
                throw new ValidationHttpException(customer.errors);
            }

            data.Order.customer_id = cus.id;
            // data.Order.total = 0;
            // data.Order.status = true;
            order.load(data, "Order");
            let res1 = await order.save({}, {transaction});
            if (!res1) {
                throw new ValidationHttpException(order.errors);
            }

            // commit
            await transaction.commit();

        } catch (e) {
            if (transaction) {
                await transaction.rollback();
                BaseChyz.warn("Rollback transaction")
            }

            if (e instanceof ValidationHttpException)
                throw new ValidationHttpException(e.message)
            else
                throw new ForbiddenHttpException(e.message)
        }
        return res.send("Post Controller")
    }


    error(req: Request, res: Response) {
        BaseChyz.logs().info("Error Sayfası")
        return res.send("Post Controller")
    }
}

module.exports = ApiController
