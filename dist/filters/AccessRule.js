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
exports.AccessRule = void 0;
var _ = require('lodash');
const Component_1 = require("../base/Component");
const InvalidConfigException_1 = require("../base/InvalidConfigException");
const Utils_1 = __importDefault(require("../requiments/Utils"));
class AccessRule extends Component_1.Component {
    constructor() {
        super(...arguments);
        /**
         * @var array|Closure parameters to pass to the [[User::can()]] function for evaluating
         * user permissions in [[$roles]].
         *
         * If this is an array, it will be passed directly to [[User::can()]]. For example for passing an
         * ID from the current request, you may use the following:
         *
         * ```php
         * ['postId' => Yii::$app->request->get('id')]
         * ```
         *
         * You may also specify a closure that returns an array. This can be used to
         * evaluate the array values only if they are needed, for example when a model needs to be
         * loaded like in the following code:
         *
         * ```php
         * 'rules' => [
         *     [
         *         'allow' => true,
         *         'actions' => ['update'],
         *         'roles' => ['updatePost'],
         *         'roleParams' => function($rule) {
         *             return ['post' => Post::findOne(Yii::$app->request->get('id'))];
         *         },
         *     ],
         * ],
         * ```
         *
         * A reference to the [[AccessRule]] instance will be passed to the closure as the first parameter.
         *
         * @see roles
         * @since 2.0.12
         */
        this.roleParams = [];
    }
    allows(action, user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.matchAction(action)
                && (yield this.matchRole(user))) {
                return this.allow;
            }
            //     if (this.matchAction($action)
            //         && this.matchRole($user)
            // && this.matchIP($request->getUserIP())
            // && this.matchVerb($request->getMethod())
            // && this.matchController($action->controller)
            // && this.matchCustom($action)
            // ) {
            //     return $this->allow ? true : false;
            // }
            return null;
        });
    }
    /**
     * @param Action $action the action
     * @return bool whether the rule applies to the action
     */
    matchAction(action) {
        return _.isEmpty(this.actions) || this.actions.includes(action.id);
    }
    /**
     * @param Controller $controller the controller
     * @return bool whether the rule applies to the controller
     */
    matchController(controller) {
        //     if (empty($this->controllers)) {
        //         return true;
        //     }
        //
        //     $id = $controller->getUniqueId();
        //     foreach ($this->controllers as $pattern) {
        //     if (StringHelper::matchWildcard($pattern, $id)) {
        //         return true;
        //     }
        // }
        return false;
    }
    matchRole(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = Utils_1.default.isEmpty(this.roles) ? [] : this.roles;
            if (!Utils_1.default.isEmpty(this.permissions)) {
                items = Utils_1.default.merge(items, this.permissions);
            }
            if (Utils_1.default.isEmpty(items)) {
                return true;
            }
            if (!user) {
                throw new InvalidConfigException_1.InvalidConfigException('The user application component must be available to specify roles in AccessRule.');
            }
            let roleParams = [];
            for (const itemsKey in items) {
                let item = items[itemsKey];
                if (item === '?') {
                    if (user.getIsGuest()) {
                        return true;
                    }
                }
                else if (item === '@') {
                    if (!user.getIsGuest()) {
                        return true;
                    }
                }
                else {
                    //roleparams
                    if (!Utils_1.default.isEmpty(this.roleParams)) {
                        roleParams = !Utils_1.default.isArray(this.roleParams) ? this.roleParams.apply(this) : this.roleParams;
                    }
                    if (yield user.can(item, this.roleParams)) {
                        return true;
                    }
                }
            }
            return false;
        });
    }
}
exports.AccessRule = AccessRule;
//# sourceMappingURL=AccessRule.js.map