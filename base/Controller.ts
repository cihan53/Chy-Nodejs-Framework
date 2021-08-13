/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {Component} from "./Component";
import {RouteDefinition} from "../model/RouteDefinition";

export class Controller extends Component {


    /**
     * @var string the ID of this controller.
     */
    public id;
    public defaultAction = 'index';

    constructor(  config: any) {
        super();
        this.id = this.constructor.name.replace("Controller","").toLowerCase();
    }

    public init() {
        super.init();
    }


    /**
     * This method is invoked right before an action is executed.
     * @param $action
     */
    public async beforeAction(route: RouteDefinition, req, res) {
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
    public afterAction(action, req, res) {

    }
}