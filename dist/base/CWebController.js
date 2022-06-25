"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CWebController = void 0;
const Component_1 = require("./Component");
class CWebController extends Component_1.Component {
    constructor(config) {
        super();
        this.defaultAction = 'index';
        this.id = this.constructor.name.replace("Controller", "").toLowerCase();
    }
    init() {
        super.init();
    }
    /**
     * This method is invoked right before an action is executed.
     * @param $action
     */
    beforeAction(route, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (route.id == "" || route.id == "/")
                this.id = this.defaultAction;
            this.ensureBehaviors();
            for (const name of Object.keys(this.getBehaviors)) {
                yield this.getBehaviors[name].beforeFilter(route, req, res);
            }
        });
    }
    /**
     * This method is invoked right after an action is executed.
     * @param action
     */
    afterAction(action, req, res) {
    }
    /**
     *

     Checks the privilege of the current user.

     This method should be overridden to check whether the current user has the privilege to run the specified action against the specified data model. If the user does not have access, a yii\web\ForbiddenHttpException should be thrown.

     */
    checkAccess(action, model = null, params = []) {
    }
    /**
     * Send data formatted as JSON.

     This method is a shortcut for sending data formatted as JSON. It will return the response application component after configuring the format and setting the data that should be formatted. A common usage will b
     */
    asJson(data) {
    }
    /**
     * Send data formatted as XML.

     This method is a shortcut for sending data formatted as XML. It will return the response application component after configuring the format and setting the data that should be formatted. A common usage will be:
     */
    asXml(data) {
    }
}
exports.CWebController = CWebController;
//# sourceMappingURL=CWebController.js.map