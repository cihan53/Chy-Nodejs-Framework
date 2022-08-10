/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {Request, Response} from "express";
import {WebUser} from "../../web/WebUser";
import {AuthMethod} from "./AuthMethod";
import {InvalidConfigException} from "../../base";
import BaseChyz from "../../BaseChyz";

export class HttpBasicAuth extends AuthMethod {

    /**
     * @var string the HTTP header name
     */
    public header = 'Authorization';


    /**
     * @var string a pattern to use to extract the HTTP authentication value
     */

    public pattern = /^Basic\s+(.*?)$/;


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


    async authenticate(user: WebUser, request:Request, response:Response) {


        let autHeader = this.getHeaderByKey(request.headers, this.header)
        if (autHeader == null || (autHeader = this.patternCheck(autHeader, this.pattern)) == null) {
            return null;
        }

        let basicauth = autHeader[1].split(":")

        let identity = await user.loginByAccessToken(basicauth, "HttpBasicAuth");
        if (identity === null) {
            this.challenge(response);
            this.handleFailure(response);
        }

        return identity;


        return null;
    }


    /**
     * @throws UnauthorizedHttpException
     */
    public fail(response:Response): void {
        this.challenge(response)
        this.handleFailure(response);
    }
}
