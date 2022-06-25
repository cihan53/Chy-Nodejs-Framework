"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebUser = void 0;
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
const BaseChyz_1 = __importDefault(require("../BaseChyz"));
const Component_1 = require("../base/Component");
const ForbiddenHttpException_1 = require("../base/ForbiddenHttpException");
const InvalidConfigException_1 = require("../base/InvalidConfigException");
const Utils_1 = __importDefault(require("../requiments/Utils"));
class WebUser extends Component_1.Component {
    constructor() {
        super(...arguments);
        /**
         * @var CheckAccessInterface|string|array The access checker object to use for checking access or the application
         * component ID of the access checker.
         * If not set the application auth manager will be used.
         * @since 2.0.9
         */
        this.accessChecker = null;
    }
    get identity() {
        return this._identity;
    }
    set identity(value) {
        this._identity = value;
    }
    init() {
        super.init();
        if (this.identityClass === null) {
            throw new InvalidConfigException_1.InvalidConfigException('User::identityClass must be set.');
        }
        this.identityClass = new this.identityClass();
    }
    getIsGuest() {
        return this.getIdentity() === null;
    }
    getIdentity(autoRenew = true) {
        return this._identity;
    }
    loginRequired() {
        throw new ForbiddenHttpException_1.ForbiddenHttpException(BaseChyz_1.default.t('Login Required'));
    }
    /**
     * Regenerates CSRF token
     *
     * @since 2.0.14.2
     */
    regenerateCsrfToken() {
    }
    /**
     * Logs in a user by the given access token.
     * @param token
     * @param type
     */
    loginByAccessToken(token, type = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let $class = this.identityClass;
            if ($class.findIdentityByAccessToken) {
                this.identity = yield $class.findIdentityByAccessToken(token, type);
                if (this.identity && this.login(this.identity)) {
                    return this.identity;
                }
            }
            else {
                BaseChyz_1.default.error("WebUser::findIdentityByAccessToken undefined");
            }
            return null;
        });
    }
    login(identity, duration = 0) {
        if (this.beforeLogin(identity, false, duration)) {
        }
        return !this.getIsGuest();
    }
    beforeLogin(identity, cookieBased, duration) {
        return true;
    }
    afterLogin() {
    }
    getId() {
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
    can(permissionName, params = [], allowCaching = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let access;
            let accessChecker;
            if ((accessChecker = this.getAccessChecker()) == null)
                return false;
            access = yield accessChecker.checkAccess(this.getId(), permissionName, params);
            if (allowCaching && Utils_1.default.isEmpty(params)) {
                // this._access[$permissionName] = $access;
            }
            return access;
        });
    }
    /**
     * Returns auth manager associated with the user component.
     *
     * By default this is the `authManager` application component.
     * You may override this method to return a different auth manager instance if needed.
     * @return \yii\rbac\ManagerInterface
     * @since 2.0.6
     */
    getAuthManager() {
        return BaseChyz_1.default.getComponent('authManager');
    }
    /**
     * Returns the access checker used for checking access.
     * @return CheckAccessInterface
     */
    getAccessChecker() {
        return this.accessChecker !== null ? this.accessChecker : this.getAuthManager();
    }
}
exports.WebUser = WebUser;
//# sourceMappingURL=WebUser.js.map