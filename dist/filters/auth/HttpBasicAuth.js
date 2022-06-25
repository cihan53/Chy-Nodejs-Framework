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
exports.HttpBasicAuth = void 0;
const AuthMethod_1 = require("./AuthMethod");
const base_1 = require("../../base");
const BaseChyz_1 = __importDefault(require("../../BaseChyz"));
class HttpBasicAuth extends AuthMethod_1.AuthMethod {
    constructor() {
        super(...arguments);
        /**
         * @var string the HTTP header name
         */
        this.header = 'Authorization';
        /**
         * @var string a pattern to use to extract the HTTP authentication value
         */
        this.pattern = /^Basic\s+(.*?)$/;
    }
    /**
     * @throws InvalidConfigException
     */
    init() {
        var _a;
        super.init();
        if (!this.pattern) {
            throw new base_1.InvalidConfigException('You must provide pattern to use to extract the HTTP authentication value!');
        }
        this.user = (_a = BaseChyz_1.default.getComponent("user")) !== null && _a !== void 0 ? _a : null;
    }
    authenticate(user, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let autHeader = this.getHeaderByKey(request.headers, this.header);
            if (autHeader == null || (autHeader = this.patternCheck(autHeader, this.pattern)) == null) {
                return null;
            }
            let basicauth = autHeader[1].split(":");
            let identity = yield user.loginByAccessToken(basicauth, "HttpBasicAuth");
            if (identity === null) {
                this.challenge(response);
                this.handleFailure(response);
            }
            return identity;
            return null;
        });
    }
    /**
     * @throws UnauthorizedHttpException
     */
    fail(response) {
        this.challenge(response);
        this.handleFailure(response);
    }
}
exports.HttpBasicAuth = HttpBasicAuth;
//# sourceMappingURL=HttpBasicAuth.js.map