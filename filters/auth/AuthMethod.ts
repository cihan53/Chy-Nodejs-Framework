/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {ActionFilter} from "../../base/ActionFilter";
import {AuthInterface} from "./AuthInterface";
import {UnauthorizedHttpException} from "../../base/UnauthorizedHttpException";
import {User} from "../../web/User";

export abstract class AuthMethod extends ActionFilter implements AuthInterface {

    /**
     * @var User the user object representing the user authentication status. If not set, the `user` application component will be used.
     */
    public user;

    /**
     * @var Request the current request. If not set, the `request` application component will be used.
     */
    public request;

    /**
     * @var Response the response to be sent. If not set, the `response` application component will be used.
     */
    public response;


    public optional = [];

    public async beforeAction(action, request, response) {
        let identity = await this.authenticate(
            this.user ?? new User(),
            request,
            response
        )


        request.identity = identity;

        if (identity !== null) {
            return true;
        }

        this.challenge(response);
        this.handleFailure(response);
        return false;
    }

    authenticate(user, request, response) {

    }

    challenge(response) {
    }

    handleFailure(response) {
        throw new UnauthorizedHttpException('Your request was made with invalid credentials.');
    }

    getHeaderByKey(headers, findKey) {
        let key = Object.keys(headers).find(key => key.toLowerCase() === findKey.toLowerCase())
        if (key) {
            return headers[key];
        }

        return null
    }

    patternCheck(headerText, pattern) {
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