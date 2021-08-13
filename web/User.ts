/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import BaseChyz from "../BaseChyz";
import {Component} from "../base/Component";
import {ForbiddenHttpException} from "../base/ForbiddenHttpException";
import {InvalidConfigException} from "../base/InvalidConfigException";
import {IdentityInterface} from "./IdentityInterface";

export class User extends Component {

    /**
     * @var string the class name of the [[identity]] object.
     */
    public identityClass: any;
    private _identity: any;


    get identity() {
        return this._identity;
    }

    set identity(value) {
        this._identity = value;
    }

    public init() {
        super.init();

        if (this.identityClass === null) {
            throw new InvalidConfigException('User::identityClass must be set.');
        }


        this.identityClass = new this.identityClass();

    }

    public getIsGuest() {
        return this.getIdentity() === null;
    }

    public getIdentity(autoRenew = true) {
        return this._identity;
    }

    public loginRequired() {

        throw new ForbiddenHttpException(BaseChyz.t('Login Required'));
    }


    /**
     * Regenerates CSRF token
     *
     * @since 2.0.14.2
     */
    protected regenerateCsrfToken() {

    }

    /**
     * Logs in a user by the given access token.
     * @param token
     * @param type
     */
    public async loginByAccessToken(token: any, type:any = null) {

        let $class = this.identityClass;
        this.identity = await $class.findIdentityByAccessToken(token, type)
        if (this.identity && this.login(this.identity)) {
            return this.identity;
        }
        return null;
    }

    public login(identity: IdentityInterface, duration = 0): boolean {

        if (this.beforeLogin(identity, false, duration)) {

        }
        return !this.getIsGuest()
    }

    public beforeLogin(identity: any, cookieBased: boolean, duration: number) {

        return true;
    }

    public afterLogin() {

    }
}