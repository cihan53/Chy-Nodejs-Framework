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
import ClientOAuth2 from "client-oauth2";

const JsonWebToken = require("jsonwebtoken");

export class Oauth2Auth extends HttpBearerAuth {
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

        let identity = null;
        let token = null;

        var githubAuth = new ClientOAuth2({
            clientId: 'abc',
            clientSecret: '123',
            accessTokenUri: 'https://github.com/login/oauth/access_token',
            authorizationUri: 'https://github.com/login/oauth/authorize',
            redirectUri: 'http://example.com/auth/github/callback',
            scopes: ['notifications', 'gist']
        });
        var uri = githubAuth.code.getUri()

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