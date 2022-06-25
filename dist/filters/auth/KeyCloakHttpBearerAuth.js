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
exports.KeyCloakHttpBearerAuth = void 0;
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
const BaseChyz_1 = __importDefault(require("../../BaseChyz"));
const HttpBearerAuth_1 = require("./HttpBearerAuth");
const InvalidConfigException_1 = require("../../base/InvalidConfigException");
const JsonWebToken = require("jsonwebtoken");
class KeyCloakHttpBearerAuth extends HttpBearerAuth_1.HttpBearerAuth {
    constructor() {
        super(...arguments);
        /**
         * @var string|array<string, mixed>|Jwt application component ID of the JWT handler, configuration array, or JWT handler object
         * itself. By default it's assumes that component of ID "jwt" has been configured.
         */
        this.jwt = 'jwt';
        this.auth = null;
        this.keycloak = null;
    }
    /**
     * @throws InvalidConfigException
     */
    init() {
        var _a, _b;
        super.init();
        if (!this.pattern) {
            throw new InvalidConfigException_1.InvalidConfigException('You must provide pattern to use to extract the HTTP authentication value!');
        }
        this.keycloak = (_a = BaseChyz_1.default.getMiddlewares("keycloak").keycloak) !== null && _a !== void 0 ? _a : null;
        this.user = (_b = BaseChyz_1.default.getComponent("user")) !== null && _b !== void 0 ? _b : null;
        this.auth = this.KeyCloakCheck;
    }
    KeyCloakCheck(token, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.keycloak == null)
                return false;
            // return await this.keycloak.protect('realm:user')(request, response, () => true /*next*/)
            return yield this.keycloak.protect()(request, response, () => true /*next*/);
        });
    }
    authenticate(user, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let identity = null;
            let token = null;
            let autHeader = this.getHeaderByKey(request.headers, this.header);
            if (autHeader == null || (autHeader = this.patternCheck(autHeader, this.pattern)) == null) {
                return null;
            }
            token = JsonWebToken.decode(autHeader[1], { complete: true });
            if (!token) {
                BaseChyz_1.default.warning("Your request was made with invalid or expired JSON Web Token.");
                this.fail(response);
            }
            if (token !== null) {
                identity = yield this.KeyCloakCheck(autHeader[1], request, response);
                BaseChyz_1.default.debug("KeyCloakCheck Result:", identity);
            }
            if (identity == null || identity == false)
                this.fail(response);
            return identity;
            /* let autHeader = this.getHeaderByKey(request.headers, this.header)
             if (autHeader == null || (autHeader = this.patternCheck(autHeader, this.pattern)) == null) {
                 return null;
             }
    
             BaseChyz.debug("JSON Web Token.",autHeader);
             let identity = null;
             let token = null;
    
             token = JsonWebToken.decode(autHeader[1], {complete: true})
             if (!token) {
                 BaseChyz.warning("Your request was made with invalid or expired JSON Web Token.");
                 this.fail(response);
             }
    
             if (token !== null) {
                 if (this.auth != null) {
                     identity = await this.auth(autHeader[1])
                 } else {
                     identity = await user.loginByAccessToken(autHeader[1], "JwtHttpBearerAuth")
                 }
             }
    
             if (identity == null) this.fail(response)
    
    
    
             return identity;*/
        });
    }
    /**
     * @throws UnauthorizedHttpException
     */
    fail(response) {
        // this.challenge(response)
        // this.handleFailure(response);
    }
}
exports.KeyCloakHttpBearerAuth = KeyCloakHttpBearerAuth;
//# sourceMappingURL=KeyCloakHttpBearerAuth.js.map