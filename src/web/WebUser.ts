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
import {Utils} from "../requiments/Utils";
import {AuthManager} from "../rbac/AuthManager";

export class WebUser extends Component {

    /**
     * @var string the class name of the [[identity]] object.
     */
    public identityClass: any;
    private _identity: any;
    /**
     * @var CheckAccessInterface|string|array The access checker object to use for checking access or the application
     * component ID of the access checker.
     * If not set the application auth manager will be used.
     * @since 2.0.9
     */
    public accessChecker: any = null;


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
    public async loginByAccessToken(token: any, type: any = null) {

        let $class = this.identityClass;
        if ($class.findIdentityByAccessToken) {
            this.identity = await $class.findIdentityByAccessToken(token, type)
            if (this.identity && this.login(this.identity)) {
                return this.identity;
            }
        } else {
            BaseChyz.error("WebUser::findIdentityByAccessToken undefined")
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

    public getId() {
        let identity = this.getIdentity();
        return identity !== null ? identity.id : null;
    }

    /**
     * Checks if the user can perform the operation as specified by the given permission.
     *
     * Note that you must configure "authManager" application component in order to use this method.
     * Otherwise it will always return false.
     *
     * @param string $permissionName the name of the permission (e.g. "edit post") that needs access check.
     * @param array $params name-value pairs that would be passed to the rules associated
     * with the roles and permissions assigned to the user.
     * @param bool $allowCaching whether to allow caching the result of access check.
     * When this parameter is true (default), if the access check of an operation was performed
     * before, its result will be directly returned when calling this method to check the same
     * operation. If this parameter is false, this method will always call
     * [[\yii\rbac\CheckAccessInterface::checkAccess()]] to obtain the up-to-date access result. Note that this
     * caching is effective only within the same request and only works when `$params = []`.
     * @return bool whether the user can perform the operation as specified by the given permission.
     */
    // public function can($permissionName, $params = [], $allowCaching = true)
    // {
    //     if ($allowCaching && empty($params) && isset($this->_access[$permissionName])) {
    //         return $this->_access[$permissionName];
    //     }
    //     if (($accessChecker = $this->getAccessChecker()) === null) {
    //         return false;
    //     }
    //     $access = $accessChecker->checkAccess($this->getId(), $permissionName, $params);
    //     if ($allowCaching && empty($params)) {
    //         $this->_access[$permissionName] = $access;
    //     }
    //
    //     return $access;
    // }

    public async can(permissionName: string, params = [], allowCaching = true) {

        let access;
        let accessChecker: AuthManager;
        if ((accessChecker = this.getAccessChecker()) == null)
            return false;


        access = await accessChecker.checkAccess(this.getId(), permissionName, params);

        if (allowCaching && Utils.isEmpty(params)) {
            // this._access[$permissionName] = $access;
        }

        return access;

    }

    /**
     * Returns auth manager associated with the user component.
     *
     * By default this is the `authManager` application component.
     * You may override this method to return a different auth manager instance if needed.
     * @return \yii\rbac\ManagerInterface
     * @since 2.0.6
     */
    protected getAuthManager(): AuthManager {
        return BaseChyz.getComponent('authManager');
    }

    /**
     * Returns the access checker used for checking access.
     * @return CheckAccessInterface
     */
    protected getAccessChecker():AuthManager {
        return this.accessChecker !== null ? this.accessChecker : this.getAuthManager();
    }


}
