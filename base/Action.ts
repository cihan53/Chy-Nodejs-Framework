/*
 *
 * Copyright (c) 2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

import {Component} from "./Component";
import {InvalidConfigException} from "./InvalidConfigException";
import BaseChyz from "../BaseChyz";

export class Action extends Component {
    /**
     * @var string ID of the action
     */
    public id: string = "";
    /**
     * @var Controller|\chyz\web\Controller|\chyz\console\Controller the controller that owns this action
     */
    public controller: any;

    /**
     * Constructor.
     *
     * @param string $id the ID of this action
     * @param Controller $controller the controller that owns this action
     * @param array $config name-value pairs that will be used to initialize the object properties
     */

    constructor(id: string, controller: any, config: any ) {
        super(config);
        this.id = id;
        this.controller = controller;
    }


    /**
     * Returns the unique ID of this action among the whole application.
     *
     * @return string the unique ID of this action among the whole application.
     */
    public getUniqueId() {
        return this.controller.getUniqueId() + '/' + this.id;
    }

    /**
     * Runs this action with the specified parameters.
     * This method is mainly invoked by the controller.
     *
     * @param array $params the parameters to be bound to the action's run() method.
     * @return mixed the result of the action
     * @throws InvalidConfigException if the action class does not have a run() method
     */
    public runWithParams(params: any) {
        if (!this.hasOwnProperty('run')) {
            throw new InvalidConfigException(this.constructor.name + ' must define a "run()" method.');
        }

        let args = this.controller.bindActionParams(this, params);
        BaseChyz.debug('Running action: ' + this.constructor.name + '::run(), invoked by ' + this.controller.constructor.name, "runWithParams");
        // if (Yii::$app->requestedParams === null) {
        //         Yii::$app->requestedParams = $args;
        //  }
        if (this.beforeRun()) {
            // @ts-ignore
            let result = this.run(args);
            this.afterRun();

            return result;
        }

        return null;
    }


    /**
     * This method is called right before `run()` is executed.
     * You may override this method to do preparation work for the action run.
     * If the method returns false, it will cancel the action.
     *
     * @return bool whether to run the action.
     */
    protected beforeRun() {
        return true;
    }

    /**
     * This method is called right after `run()` is executed.
     * You may override this method to do post-processing work for the action run.
     */
    protected afterRun() {
    }
}