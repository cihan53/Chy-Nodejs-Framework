/*
 *
 * Copyright (c) 2021-2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

import {BaseChyz, controller, CWebController, ForbiddenHttpException, get, JwtHttpBearerAuth, ModelManager, post, Request, Response, ValidationHttpException} from "../../src";
import Util from "util";
import {Logger} from "chyz/base/Logger";

@controller("/api")
export class ApiController extends CWebController {

    public myCheck(token: any) {
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

        Logger.info(Util.format("Serial Found [user_id %s] [serial %s]", req?.identity.id ))

        Logger.info("Site Controller Burası")
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

        } catch (e: any) {
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
        Logger.info("Error Sayfası")
        return res.send("Post Controller")
    }
}

