/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {HttpHeaderAuth} from "./HttpHeaderAuth";
import {Response} from "express";

export class HttpBearerAuth extends HttpHeaderAuth {

    /**
     * {@inheritdoc}
     */
    public header = 'Authorization';
    // @ts-ignore
    public pattern = /^Bearer\s+(.*?)$/;
    /**
     * @var string the HTTP authentication realm
     */
    public realm = 'api';


    /**
     * {@inheritdoc}
     */
    public challenge(response: Response):Response {
        response.set('WWW-Authenticate', `Bearer realm="${this.realm}"`);
        return response;
    }
}
