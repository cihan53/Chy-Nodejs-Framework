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


    public auth: any = null;

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


    async authenticate(user: WebUser, request: Request, response: Response) {


        let autHeader = this.getHeaderByKey(request.headers, this.header)
        if (autHeader == null || (autHeader = this.patternCheck(autHeader, this.pattern)) == null) {
            return null;
        }

        let identity = null;
        let token = null;

        let buff = new Buffer(autHeader[1], "base64");
        let basicauth = buff.toString().split(":");

        if (this.auth != null) {
            identity = await this.auth(autHeader[1], ...arguments, basicauth)
        } else {
            identity = await user.loginByAccessToken(basicauth, "HttpBasicAuth");
        }


        if (identity == null) this.fail(response)
        return identity;

    }


    /**
     * @throws UnauthorizedHttpException
     */
    public fail(response: Response): void {
        this.challenge(response)
        this.handleFailure(response);
    }
}
