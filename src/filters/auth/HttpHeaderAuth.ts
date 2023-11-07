/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {AuthMethod} from "./AuthMethod";
import {WebUser} from "../../web/WebUser";
import {Utils} from "../../requiments/Utils";
import {Request, Response} from "express";

export class HttpHeaderAuth extends AuthMethod {
    /**
     * @var string the HTTP header name
     */
    public header = 'X-Api-Key';


    /**
     * @var string a pattern to use to extract the HTTP authentication value
     */

    public pattern!: string;


    async authenticate(user: WebUser, request:Request, response:Response) {
        let key = Object.keys(request.headers).find(key => key.toLowerCase() === this.header.toLowerCase())
        if (key) {
            let authHeader:any = request.headers[key];
            if (!Utils.isEmpty(authHeader)) {
                if (this.pattern) {
                    //preg_match
                    let matches = authHeader.match(this.pattern)
                    if (matches && matches.length > 0) {
                        authHeader = matches[1];
                    } else {
                        return this.fail(response);
                    }
                }

                let identity = await user.loginByAccessToken(authHeader, "HttpHeaderAuth");
                if (identity === null) {
                    this.challenge(response);
                    this.handleFailure(response);
                }

                return identity;
            }
        }
        return this.fail(response);
    }

    /**
     * @throws UnauthorizedHttpException
     */
    public fail(response: Response): void {
        this.challenge(response)
        this.handleFailure(response);
    }
}
