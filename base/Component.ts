/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {BaseObject} from "./BaseObject";
import {ActionFilter} from "./ActionFilter";
import Utils from "../requiments/Utils";

export class Component extends BaseObject {

    /**
     * @var array the attached event handlers (event name => handlers)
     */
    private _events = [];


    /**
     * @var Behavior[]|null the attached behaviors (behavior name => behavior). This is `null` when not initialized.
     */

    private _behaviors: Array<ActionFilter> = [];


    /**
     *  Returns a list of behaviors that this component should behave as.
     */
    public behaviors() {
        return [];
    }


    get getBehaviors(): any {
        return this._behaviors;
    }

    /**
     * Makes sure that the behaviors declared in [[behaviors()]] are attached to this component.
     */
    public ensureBehaviors() {
        if (this._behaviors.length == 0) {
            this._behaviors = [];
            if (this.behaviors().length > 0) {
                this.behaviors().forEach(behavior => {
                    Object.keys(behavior).forEach((name: string) => {
                        this.attachBehaviorInternal(name, behavior)
                    });
                })
            }

        }
    }


    private attachBehaviorInternal(name: any, behavior: any) {
        if (!this._behaviors.hasOwnProperty(name)) {
            let beh = Utils.createObject(new behavior[name].class, behavior[name])
            beh.init()
            this._behaviors[name] = beh;
        }
        return behavior;
    }

}