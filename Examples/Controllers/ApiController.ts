/*
 *
 * Copyright (c) 2021-2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

import {BaseChyz, controller, CWebController, ForbiddenHttpException, get, ModelManager, post, Request, Response, ValidationHttpException, Utils, AccessControl, JwtHttpBearerAuth} from "../../src";
import {User} from "../Models/User";
import {AuthManager} from "../../src/rbac/AuthManager"

const bcrypt = require('bcrypt');
const JsonWebToken = require("jsonwebtoken");
@controller("/api")
export class ApiController extends CWebController {

    public myCheck(token: any) {
        console.log("myyyyyyyyyyyyyyyyyyyyy")
    }

    public behaviors(): any[] {
        return [{
            'authenticator': {
                "class": JwtHttpBearerAuth,
                "except": ["login"]
                // "auth": this.myCheck
            },
            'access': {
                'class': AccessControl,
                // 'only': ['hello' ],
                'rules': [

                    {
                        'allow': true,
                        'actions': ['hello' ],
                        'roles': ['edisboxnew'],
                    }
                ]
            }
        }]
    }

    @get("/")
    Index(req: Request, res: Response) {
        // BaseChyz.info(Util.format("Serial Found [user_id %s] [serial %s]", req?.identity.id ))

        BaseChyz.info("Site Controller Burası")
        return res.json({message: "index sayfası"})
    }

    @get("hello")
    OrderList(req: Request, res: Response) {
        // BaseChyz.info(Util.format("Serial Found [user_id %s] [serial %s]", req?.identity.id ))

        BaseChyz.info("order/list")
        return res.json({message: "order/list"})
    }

    @post("login")
    async login(req: Request, res: Response) {
        let UserModel: User = new User();
        let token
        let username = req.body.username;
        let password = req.body.password;
        let user = await UserModel.findOne({where: {username: username}})
        if (user) {
            BaseChyz.debug("Db found user", username)
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                BaseChyz.debug("Db user verify", username)
                //login
                let xForwardedFor: string = (req.headers['x-forwarded-for'] || '').toString().replace(/:\d+$/, '');
                let ip = xForwardedFor || req.socket.remoteAddress;
                let source: string = req.headers['user-agent'] || '';
                if (req.headers['x-ucbrowser-ua']) {  //special case of UC Browser
                    source = req.headers['x-ucbrowser-ua'].toString();
                }

                // let permission = await ModelManager.UserPermission.findOne({where: {id: user.permissions_id}})
                // let AuthAssignment = await ModelManager.AuthAssignment.findOne({where: {user_id: user.id.toString()}, attributes: ["item_name"]})
                // let AuthItems = await BaseChyz.getComponent("authManager").getRolesByUser(user.id.toString());
                let AuthManager: AuthManager = await BaseChyz.getComponent("authManager")
                let userPermissions = await AuthManager.getPermissionsByUser(user.id)
                let RolesByUser = await AuthManager.getRolesByUser(user.id);
                // RolesByUser["permission"] = userPermissions


                let expired = null;

                if (Utils.isEmpty(RolesByUser)) {
                    let error: any = new ForbiddenHttpException(BaseChyz.t('You are not allowed to perform this action.'))
                    res.status(500).json(error.toJSON())
                    return;
                }


                token = await JsonWebToken.sign({
                    user: user.id,
                    ip: ip,
                    agent: source,
                    role: Object.keys(RolesByUser),
                    permissions: Object.keys(userPermissions),
                    // AuthAssignment: AuthAssignment,
                    platform: Object.keys(RolesByUser)[0].toLowerCase() || "guest"
                }, user.authkey, expired);

                // BaseChyz.debug("Db user create access token", username, "expiresIn", "1h")
                return res.json({
                    token: token,
                    // userPermissions,
                    // RolesByUser
                })
            } else {
                let error: any = new ForbiddenHttpException(BaseChyz.t('You are not allowed to perform this action.'))
                res.status(500).json(error.toJSON())
            }
        } else {
            let error: any = new ForbiddenHttpException(BaseChyz.t('You are not allowed to perform this action.'))
            res.status(500).json(error.toJSON())
        }


    }


    error(req: Request, res: Response) {
        BaseChyz.info("Error Sayfası")
        return res.send("Post Controller")
    }
}

