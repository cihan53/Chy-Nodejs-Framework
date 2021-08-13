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
import {User} from "../web/User";
import Utils from "../requiments/Utils";
import {NextFunction, Request, Response} from "express";

var _ = require('lodash');


export class AccessControl extends ActionFilter {

    public user: User = new User;
    public rules: any;

    public init() {
        super.init()

        if (this.user == undefined) {
            this.user = Utils.cloneDeep(BaseChyz.getComponent("user")) ?? new User();
        }

        this.rules.forEach((rule:any, index:number) => {
            if (rule === Object(rule)) {
                this.rules[index] = Utils.createObject(new AccessRule(), rule);
            }
        })
    }


    public beforeAction(action:any, request:Request) {
        let allow;
        // @ts-ignore
        let user = request.user ?? this.user;
        // @ts-ignore
        user.identity = request.identity;

        for (const rulesKey in this.rules) {
            if ((allow = this.rules[rulesKey].allows(action, user, request))) {
                return true;
            } else if (allow === false) {
                this.denyAccess(user);
            }
        }
        this.denyAccess(user);
        return false;
    }

    public denyAccess(user: User) {
        if (user != undefined && user.getIsGuest()) {
            user.loginRequired();
        } else throw new ForbiddenHttpException(BaseChyz.t('You are not allowed to perform this action.'));
    }

}
