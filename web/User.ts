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
    public identityClass;

    /**
     * @var int the number of seconds in which the user will be logged out automatically if the user
     * remains inactive. If this property is not set, the user will be logged out after
     * the current session expires (c.f. [[Session::timeout]]).
     * Note that this will not work if [[enableAutoLogin]] is `true`.
     */
    public authTimeout;


    private _identity;


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

    public getIdentity( autoRenew = true) {
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
    public async loginByAccessToken(token, type = null) {

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

    public beforeLogin($identity, $cookieBased, $duration) {

        return true;
    }

    public afterLogin() {

    }
}