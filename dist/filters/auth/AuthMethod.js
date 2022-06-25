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
exports.AuthMethod = void 0;
const ActionFilter_1 = require("../../base/ActionFilter");
const UnauthorizedHttpException_1 = require("../../base/UnauthorizedHttpException");
const WebUser_1 = require("../../web/WebUser");
class AuthMethod extends ActionFilter_1.ActionFilter {
    constructor() {
        super(...arguments);
        this.optional = [];
    }
    beforeAction(action, request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let identity = yield this.authenticate((_a = this.user) !== null && _a !== void 0 ? _a : new WebUser_1.WebUser(), request, response);
            // @ts-ignore
            request.identity = identity;
            if (identity !== null) {
                return true;
            }
            this.challenge(response);
            this.handleFailure(response);
            return false;
        });
    }
    authenticate(user, request, response) {
    }
    // @ts-ignore
    challenge(response) {
    }
    // @ts-ignore
    handleFailure(response) {
        throw new UnauthorizedHttpException_1.UnauthorizedHttpException('Your request was made with invalid credentials.');
    }
    getHeaderByKey(headers, findKey) {
        let key = Object.keys(headers).find(key => key.toLowerCase() === findKey.toLowerCase());
        if (key) {
            return headers[key];
        }
        return null;
    }
    patternCheck(headerText, pattern) {
        if (pattern) {
            let matches = headerText.match(pattern);
            if (matches && matches.length > 0) {
                return matches;
            }
            else {
                return null;
            }
        }
        return null;
    }
}
exports.AuthMethod = AuthMethod;
//# sourceMappingURL=AuthMethod.js.map