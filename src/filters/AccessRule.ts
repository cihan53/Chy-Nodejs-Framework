/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import {WebUser} from "../web/WebUser";
import {Component} from "../base/Component";
import {InvalidConfigException} from "../base/InvalidConfigException";
import {Request} from "express";
import {Utils} from "../requiments/Utils";

var _ = require('lodash');

export class AccessRule extends Component {

    /**
     * @var bool whether this is an 'allow' rule or 'deny' rule.
     */
    public allow: any;
    /**
     * @var array list of action IDs that this rule applies to. The comparison is case-sensitive.
     * If not set or empty, it means this rule applies to all actions.
     */
    public actions: any;

    /**
     *  @var array list of the controller IDs that this rule applies to.
     */
    public controllers: any;

    /**
     * - `?`: matches a guest user (not authenticated yet)
     * - `@`: matches an authenticated user
     */

    public roles: any;

    /**
     * @var array list of RBAC (Role-Based Access Control) permissions that this rules applies to.
     */
    public permissions: any;

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
    public roleParams: any = [];


    /**
     * @var array list of user IP addresses that this rule applies to. An IP address
     * can contain the wildcard `*` at the end so that it matches IP addresses with the same prefix.
     * For example, '192.168.*' matches all IP addresses in the segment '192.168.'.
     * It may also contain a pattern/mask like '172.16.0.0/12' which would match all IPs from the
     * 20-bit private network block in RFC1918.
     * If not set or empty, it means this rule applies to all IP addresses.
     */
    public ips: any;


    public async allows(action: any, user: WebUser, request: Request) {
        if (
            this.matchAction(action)
            && await this.matchRole(user)
        ) {
            return this.allow
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

        return false;
    }

    /**
     * @param Action $action the action
     * @return bool whether the rule applies to the action
     */
    protected matchAction(action: any) {
        return _.isEmpty(this.actions) || this.actions.includes(action.id);
    }

    /**
     * @param Controller $controller the controller
     * @return bool whether the rule applies to the controller
     */
    protected matchController(controller: any) {
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

    protected async matchRole(user: WebUser) {
        let items = Utils.isEmpty(this.roles) ? [] : this.roles;

        if (!Utils.isEmpty(this.permissions)) {
            items = Utils.merge(items, this.permissions);
        }

        if (Utils.isEmpty(items)) {
            return true;
        }


        if (!user) {
            throw new InvalidConfigException('The user application component must be available to specify roles in AccessRule.');
        }

        // @ts-ignore
        let roleParams: any = [];
        for (const itemsKey in items) {
            let item = items[itemsKey];
            if (item === '?') {
                if (user.getIsGuest()) {
                    return true;
                }
            } else if (item === '@') {
                if (!user.getIsGuest()) {
                    return true;
                }
            } else {
                //roleparams
                if (!Utils.isEmpty(this.roleParams)) {
                    roleParams = !Utils.isArray(this.roleParams) ? this.roleParams.apply(this) : this.roleParams;
                }

                if (await user.can(item, this.roleParams)) {
                    return true;
                }
            }
        }


        return false;
    }


}
