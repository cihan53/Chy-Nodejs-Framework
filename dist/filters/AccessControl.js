"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessControl = void 0;
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
const BaseChyz_1 = __importDefault(require("../BaseChyz"));
const ForbiddenHttpException_1 = require("../base/ForbiddenHttpException");
const ActionFilter_1 = require("../base/ActionFilter");
const AccessRule_1 = require("./AccessRule");
const WebUser_1 = require("../web/WebUser");
const Utils_1 = __importDefault(require("../requiments/Utils"));
var _ = require('lodash');
class AccessControl extends ActionFilter_1.ActionFilter {
    constructor() {
        super(...arguments);
        this.user = null;
        this.denyCallback = null;
    }
    init() {
        var _a;
        super.init();
        if (this.user == undefined) {
            this.user = (_a = Utils_1.default.cloneDeep(BaseChyz_1.default.getComponent("user"))) !== null && _a !== void 0 ? _a : new WebUser_1.WebUser();
        }
        this.rules.forEach((rule, index) => {
            if (rule === Object(rule)) {
                this.rules[index] = Utils_1.default.createObject(new AccessRule_1.AccessRule(), rule);
            }
        });
    }
    beforeAction(action, request) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let allow;
            // @ts-ignore
            let user = (_a = request.user) !== null && _a !== void 0 ? _a : this.user;
            // @ts-ignore
            user.identity = (_b = request.identity) !== null && _b !== void 0 ? _b : null;
            for (const rulesKey in this.rules) {
                let rule = this.rules[rulesKey];
                if ((allow = yield rule.allows(action, user, request))) {
                    return true;
                }
                else if (allow === false) {
                    if (this.denyCallback != null) {
                        rule.denyCallback.apply(rule, action);
                    }
                    else {
                        this.denyAccess(user);
                    }
                    return false;
                }
            }
            if (this.denyCallback != null) {
                this.denyCallback.apply(null, action);
            }
            else {
                this.denyAccess(user);
            }
            return false;
        });
    }
    denyAccess(user) {
        if (user != undefined && user.getIsGuest()) {
            user.loginRequired();
        }
        else
            throw new ForbiddenHttpException_1.ForbiddenHttpException(BaseChyz_1.default.t('You are not allowed to perform this action.'));
    }
}
exports.AccessControl = AccessControl;
//# sourceMappingURL=AccessControl.js.map