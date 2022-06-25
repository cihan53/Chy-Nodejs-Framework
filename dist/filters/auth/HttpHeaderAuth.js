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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpHeaderAuth = void 0;
const AuthMethod_1 = require("./AuthMethod");
const Utils_1 = __importDefault(require("../../requiments/Utils"));
class HttpHeaderAuth extends AuthMethod_1.AuthMethod {
    constructor() {
        super(...arguments);
        /**
         * @var string the HTTP header name
         */
        this.header = 'X-Api-Key';
    }
    authenticate(user, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let key = Object.keys(request.headers).find(key => key.toLowerCase() === this.header.toLowerCase());
            if (key) {
                let authHeader = request.headers[key];
                if (!Utils_1.default.isEmpty(authHeader)) {
                    if (this.pattern) {
                        //preg_match
                        let matches = authHeader.match(this.pattern);
                        if (matches && matches.length > 0) {
                            authHeader = matches[1];
                        }
                        else {
                            return null;
                        }
                    }
                    let identity = yield user.loginByAccessToken(authHeader, "HttpHeaderAuth");
                    if (identity === null) {
                        this.challenge(response);
                        this.handleFailure(response);
                    }
                    return identity;
                }
            }
            return null;
        });
    }
}
exports.HttpHeaderAuth = HttpHeaderAuth;
//# sourceMappingURL=HttpHeaderAuth.js.map