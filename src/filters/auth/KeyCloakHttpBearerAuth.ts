/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import BaseChyz from "../../BaseChyz";
import {HttpBearerAuth} from "./HttpBearerAuth";
import {InvalidConfigException} from "../../base/InvalidConfigException";
import {Request, Response} from "express";
import {WebUser} from "../../web/WebUser";

const JsonWebToken = require("jsonwebtoken");

export class KeyCloakHttpBearerAuth extends HttpBearerAuth {
    /**
     * @var string|array<string, mixed>|Jwt application component ID of the JWT handler, configuration array, or JWT handler object
     * itself. By default it's assumes that component of ID "jwt" has been configured.
     */
    public jwt = 'jwt'
    public auth: any = null;
    public keycloak: any = null;


    /**
     * @throws InvalidConfigException
     */
    public init(): void {
        super.init();

        if (!this.pattern) {
            throw new InvalidConfigException('You must provide pattern to use to extract the HTTP authentication value!');
        }

        this.keycloak = BaseChyz.getMiddlewares("keycloak").keycloak ?? null;
        this.user = BaseChyz.getComponent("user") ?? null;
        this.auth = this.KeyCloakCheck;


    }

    public async KeyCloakCheck(token: string, request: Request, response: Response,) {
        if (this.keycloak == null) return false;
        // return await this.keycloak.protect('realm:user')(request, response, () => true /*next*/)
        return await this.keycloak.protect()(request, response, () => true /*next*/);
    }


    public async authenticate(user: WebUser, request: Request, response: Response) // BC signature
    {

        let identity = null;
        let token = null;

        let autHeader = this.getHeaderByKey(request.headers, this.header)
        if (autHeader == null || (autHeader = this.patternCheck(autHeader, this.pattern)) == null) {
            return null;
        }

        token = JsonWebToken.decode(autHeader[1], {complete: true})
        if (!token) {
            BaseChyz.warning("Your request was made with invalid or expired JSON Web Token.");
            this.fail(response);
        }

        if (token !== null) {
            identity = await this.KeyCloakCheck(autHeader[1], request, response)
            BaseChyz.debug("KeyCloakCheck Result:", identity)
        }

        if (identity == null || identity == false) this.fail(response)

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
    }


    /**
     * @throws UnauthorizedHttpException
     */
    public fail(response: Response): void {
        // this.challenge(response)
        // this.handleFailure(response);
    }

}
