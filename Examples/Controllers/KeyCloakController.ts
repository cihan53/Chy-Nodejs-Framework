/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {Controller} from "../../base/Controller";
import BaseChyz from "../../BaseChyz";
// @ts-ignore
import {Request, Response} from "express";
import {get} from "../../decorator/get";
import {post} from "../../decorator/post";
import {controller} from "../../decorator/controller";
import {AccessControl} from "../../filters/AccessControl";
import {JwtHttpBearerAuth} from "../../filters/auth/JwtHttpBearerAuth";
import {Order} from "../Models/Order";
import {Customer} from "../Models/Customer";
import {ValidationHttpException} from "../../base/ValidationHttpException";
import {ValidationError} from "sequelize";
import {ForbiddenHttpException} from "../../base";
import {KeyCloakHttpBearerAuth} from "../../filters/auth/KeyCloakHttpBearerAuth";

@controller("/oauth2.0")
class ApiController extends Controller {

    public behaviors(): any[] {

        return [{
            'authenticator': {
                "class": KeyCloakHttpBearerAuth,
                // "auth": this.myCheck
            }
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
        let customer: Customer = new Customer();
        //Order Model Create
        let order: Order = new Order();


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