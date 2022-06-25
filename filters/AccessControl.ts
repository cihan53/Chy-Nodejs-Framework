/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import BaseChyz from "../BaseChyz";
import {ForbiddenHttpException} from "../base/ForbiddenHttpException";
import {ActionFilter} from "../base/ActionFilter";
import {AccessRule} from "./AccessRule";
import {WebUser} from "../web/WebUser";
import Utils from "../requiments/Utils";
import {NextFunction, Request, Response} from "express";

export class AccessControl extends ActionFilter {

    public user: any = null;
    public rules: any;
    public denyCallback: any = null;

    public init() {
        super.init()

        if (this.user == undefined) {
            this.user = Utils.cloneDeep(BaseChyz.getComponent("user")) ?? new WebUser();
        }

        this.rules.forEach((rule: any, index: number) => {
            if (rule === Object(rule)) {
                this.rules[index] = Utils.createObject(new AccessRule(), rule);
            }
        })
    }


    public async beforeAction(action: any, request: Request) {
        let allow;
        // @ts-ignore
        let user = request.user ?? this.user;
        // @ts-ignore
        user.identity = request.identity ?? null;

        for (const rulesKey in this.rules) {

            let rule = this.rules[rulesKey];
            if ((allow = await rule.allows(action, user, request))) {
                return true;
            } else if (allow === false) {
                if (this.denyCallback != null) {
                    rule.denyCallback.apply(rule, action);
                } else {
                    this.denyAccess(user);
                }
                return false;
            }
        }


        if (this.denyCallback != null) {
            this.denyCallback.apply(null, action);
        } else {
            this.denyAccess(user);
        }

        return false;
    }

    public denyAccess(user: WebUser) {
        if (user != undefined && user.getIsGuest()) {
            user.loginRequired();
        } else throw new ForbiddenHttpException(BaseChyz.t('You are not allowed to perform this action.'));
    }

}
