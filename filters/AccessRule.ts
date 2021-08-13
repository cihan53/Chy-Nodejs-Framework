/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import {User} from "../web/User";

var _ = require('lodash');
import {Component} from "../base/Component";
import {InvalidConfigException} from "../base/InvalidConfigException";
import {Request, Response} from "express";

export class AccessRule extends Component {

    /**
     * @var bool whether this is an 'allow' rule or 'deny' rule.
     */
    public allow:any;
    /**
     * @var array list of action IDs that this rule applies to. The comparison is case-sensitive.
     * If not set or empty, it means this rule applies to all actions.
     */
    public actions:any;

    /**
     *  @var array list of the controller IDs that this rule applies to.
     */
    public controllers:any;

    /**
     * - `?`: matches a guest user (not authenticated yet)
     * - `@`: matches an authenticated user
     */

    public roles:any;

    /**
     * @var array list of RBAC (Role-Based Access Control) permissions that this rules applies to.
     */
    public permissions:any;

    /**
     * @var array list of user IP addresses that this rule applies to. An IP address
     * can contain the wildcard `*` at the end so that it matches IP addresses with the same prefix.
     * For example, '192.168.*' matches all IP addresses in the segment '192.168.'.
     * It may also contain a pattern/mask like '172.16.0.0/12' which would match all IPs from the
     * 20-bit private network block in RFC1918.
     * If not set or empty, it means this rule applies to all IP addresses.
     */
    public ips:any;


    public allows(action:any, user:User, request:Request) {
        if (
            this.matchAction(action)
            && this.matchRole(user)
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

        return null;
    }

    /**
     * @param Action $action the action
     * @return bool whether the rule applies to the action
     */
    protected matchAction(action:any) {
        return _.isEmpty(this.actions) || this.actions.includes(action.id);
    }

    /**
     * @param Controller $controller the controller
     * @return bool whether the rule applies to the controller
     */
    protected matchController(controller:any) {
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

    protected matchRole(user:any) {
        let items = _.isEmpty(this.roles) ? [] : this.roles;

        if (!_.isEmpty(this.permissions)) {
            items = _.merge(items, this.permissions);
        }

        if (_.isEmpty(items)) {
            return true;
        }


        if (user === false) {
            throw new InvalidConfigException('The user application component must be available to specify roles in AccessRule.');
        }

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
            }
        }


        return false;
    }


}