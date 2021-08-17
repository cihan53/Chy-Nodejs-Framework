/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {Component} from "./Component";
import {RouteDefinition} from "../model/RouteDefinition";
import {Request, Response} from "express";

export class Controller extends Component {


    /**
     * @var string the ID of this controller.
     */
    public id: string;
    public defaultAction = 'index';

    constructor(config: any) {
        super();
        this.id = this.constructor.name.replace("Controller", "").toLowerCase();
    }

    public init() {
        super.init();
    }


    /**
     * This method is invoked right before an action is executed.
     * @param $action
     */
    public async beforeAction(route: RouteDefinition, req: Request, res: Response) {
        if (route.id == "" || route.id == "/")
            this.id = this.defaultAction

        this.ensureBehaviors()
        for (const name of Object.keys(this.getBehaviors)) {
            await this.getBehaviors[name].beforeAction(route, req, res)
        }

    }

    /**
     * This method is invoked right after an action is executed.
     * @param action
     */
    public afterAction(action: any, req: Request, res: Response) {

    }

    /**
     *

     Checks the privilege of the current user.

     This method should be overridden to check whether the current user has the privilege to run the specified action against the specified data model. If the user does not have access, a yii\web\ForbiddenHttpException should be thrown.

     */
    public checkAccess(action: any, model = null, params: any = []) {

    }

    /**
     * Send data formatted as JSON.

     This method is a shortcut for sending data formatted as JSON. It will return the response application component after configuring the format and setting the data that should be formatted. A common usage will b
     */
    asJson(data: any) {

    }

    /**
     * Send data formatted as XML.

     This method is a shortcut for sending data formatted as XML. It will return the response application component after configuring the format and setting the data that should be formatted. A common usage will be:
     */
    asXml(data: any) {

    }

}