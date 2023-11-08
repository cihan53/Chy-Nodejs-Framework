/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {ActionFilter} from "../../base";
import {AuthInterface} from "./AuthInterface";
import {UnauthorizedHttpException} from "../../base";
import {WebUser} from "../../web/WebUser";
import {Request, Response} from "express";

export abstract class AuthMethod extends ActionFilter implements AuthInterface {

    /**
     * @var user the user object representing the user authentication status. If not set, the `user` application component will be used.
     */
    public user: WebUser | undefined;

    /**
     * @var Request the current request. If not set, the `request` application component will be used.
     */
    public request: Request | undefined;

    /**
     * @var Response the response to be sent. If not set, the `response` application component will be used.
     */
    public response: Response | undefined;


    public optional = [];

    /**
     *
     * @param action
     * @param request
     * @param response
     */
    public async beforeAction(action: any, request: Request, response: Response) {
        let identity =await this.authenticate(
            this.user ?? new WebUser(),
            request,
            response
        )

        // @ts-ignore
        request.identity = identity;

        if (identity !== null) {
            return true;
        }

        this.challenge(response);
        this.handleFailure(response);
        return false;
    }

    /**
     *
     * @param user
     * @param request
     * @param response
     */
    authenticate(user: WebUser, request: Request, response: Response) {

    }

    // @ts-ignore
    challenge(response: Response): Response {

    }

    // @ts-ignore
    handleFailure(response: Response): Response {
        throw new UnauthorizedHttpException('Your request was made with invalid credentials.');
    }

    getHeaderByKey(headers: any, findKey: any) {
        let key = Object.keys(headers).find(key => key.toLowerCase() === findKey.toLowerCase())
        if (key) {
            return headers[key];
        }

        return null
    }

    patternCheck(headerText: any, pattern: RegExp) {
        if (pattern) {
            let matches = headerText.match(pattern)
            if (matches && matches.length > 0) {
                return matches;
            } else {
                return null
            }
        }

        return null
    }
}
