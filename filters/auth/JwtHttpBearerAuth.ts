/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import BaseChyz from "../../BaseChyz";
import {HttpBearerAuth} from "./HttpBearerAuth";
import {InvalidConfigException} from "../../base/InvalidConfigException";
import {UnauthorizedHttpException} from "../../base/UnauthorizedHttpException";
import {Response,Request} from "express";
import {User} from "../../web/User";

const JsonWebToken = require("jsonwebtoken");

export class JwtHttpBearerAuth extends HttpBearerAuth {
    /**
     * @var string|array<string, mixed>|Jwt application component ID of the JWT handler, configuration array, or JWT handler object
     * itself. By default it's assumes that component of ID "jwt" has been configured.
     */
    public jwt = 'jwt'
    public auth:any = null;

    /**
     * @throws InvalidConfigException
     */
    public init(): void {
        super.init();

        if (!this.pattern) {
            throw new InvalidConfigException('You must provide pattern to use to extract the HTTP authentication value!');
        }

        this.user = BaseChyz.getComponent("user") ?? null;
    }


    public async authenticate(user:User, request:Request, response:Response) // BC signature
    {

        let autHeader = this.getHeaderByKey(request.headers, this.header)

        if (autHeader == null || (autHeader = this.patternCheck(autHeader, this.pattern)) == null) {
            return null;
        }


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


        return identity;
    }


    /**
     * @throws UnauthorizedHttpException
     */
    public fail(response:Response): void {
        this.challenge(response)
        this.handleFailure(response);
    }

}