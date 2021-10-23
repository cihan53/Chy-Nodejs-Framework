/*
 *
 * Copyright (c) 2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

import {Action} from "./Action";
import {BaseChyz} from "../index";

/**
 * InlineAction represents an action that is defined as a controller method.
 *
 * The name of the controller method is available via [[actionMethod]] which
 * is set by the [[controller]] who creates this action.
 *
 * For more details and usage information on InlineAction, see the [guide article on actions](guide:structure-controllers).
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
export class InlineAction extends Action {

    /**
     * @var string the controller method that this inline action is associated with
     */
    public actionMethod: string = "";


    /**
     * @param id
     * @param controller
     * @param actionMethod
     * @param config
     */

    constructor(id: string, controller: any, actionMethod: any, config: any = null) {
        super(id, controller, config);
        this.actionMethod = actionMethod;
    }


    /**
     * Runs this action with the specified parameters.
     * This method is mainly invoked by the controller.
     * @return mixed the result of the action
     * @param params
     */
    public runWithParams(params: any) {
        let args = this.controller.bindActionParams(this, params);
        BaseChyz.debug('Running action: ' + this.controller.constructor.name + '::' + this.actionMethod + '()', "runWithParams");
        // if (Yii::$app->requestedParams === null) {
        //         Yii::$app->requestedParams = $args;
        // }
        //
        return this.controller[this.actionMethod](args);
    }
}
