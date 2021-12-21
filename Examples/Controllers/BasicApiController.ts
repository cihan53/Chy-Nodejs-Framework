/*
 *
 * Copyright (c) 2021-2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

import {Controller, ForbiddenHttpException, ModelManager, ValidationHttpException} from "../../base";
import BaseChyz from "../../BaseChyz";
// @ts-ignore
import {Request, Response} from "express";
import {controller, get, post} from "../../decorator";
import {ProductsClass} from "../Models/Products";
import {HttpBasicAuth} from "../../filters/auth/HttpBasicAuth";


@controller("/basic/api")
class ApiController extends Controller {



    public behaviors(): any[] {

        return [{
            'authenticator': {
                "class": HttpBasicAuth,
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


    @get("order/list")
    async listOrder(req: Request, res: Response) {
        const {Products}: { Products: ProductsClass } = ModelManager;
        let product = await Products.findAll({include: [ModelManager.ProductModels.model()]});
        return res.json(product)

    }

    @get("categories")
    async Categories(req: Request, res: Response) {
        let product = await ModelManager.Categories.findAll({
            include: [
                {
                    model: ModelManager.Products.model(),
                    // as: 'product',
                    // through: { attributes: [] } // Hide unwanted `PlayerGameTeam` nested object from results
                }
            ]
        });
        return res.json(product)

    }


    error(req: Request, res: Response) {
        BaseChyz.logs().info("Error Sayfası")
        return res.send("Post Controller")
    }
}

module.exports = ApiController