"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const BaseObject_1 = require("./BaseObject");
const Utils_1 = __importDefault(require("../requiments/Utils"));
class Component extends BaseObject_1.BaseObject {
    constructor() {
        super(...arguments);
        /**
         * @var array the attached event handlers (event name => handlers)
         */
        this._events = [];
        /**
         * @var Behavior[]|null the attached behaviors (behavior name => behavior). This is `null` when not initialized.
         */
        this._behaviors = [];
    }
    /**
     *  Returns a list of behaviors that this component should behave as.
     */
    behaviors() {
        return [];
    }
    get getBehaviors() {
        return this._behaviors;
    }
    /**
     * Makes sure that the behaviors declared in [[behaviors()]] are attached to this component.
     */
    ensureBehaviors() {
        if (this._behaviors.length == 0) {
            this._behaviors = [];
            if (this.behaviors().length > 0) {
                this.behaviors().forEach(behavior => {
                    Object.keys(behavior).forEach((name) => {
                        this.attachBehaviorInternal(name, behavior);
                    });
                });
            }
        }
    }
    attachBehaviorInternal(name, behavior) {
        if (!this._behaviors.hasOwnProperty(name)) {
            let beh = Utils_1.default.createObject(new behavior[name].class, behavior[name]);
            beh.init();
            this._behaviors[name] = beh;
        }
        return behavior;
    }
}
exports.Component = Component;
//# sourceMappingURL=Component.js.map