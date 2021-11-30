/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {Controller} from "../../base/Controller";
import BaseChyz from "../../BaseChyz";
// @ts-ignore
import {Request, Response} from "express";
import {get} from "../../decorator/get";
import {post} from "../../decorator/post";
import {controller} from "../../decorator/controller";
import {User} from "../Models/User";
import {ForbiddenHttpException} from "../../base";
import {JwtHttpBearerAuth} from "../../filters/auth";

const bcrypt = require('bcrypt');
const JsonWebToken = require("jsonwebtoken");


@controller("/site")
class SiteController extends Controller {

    public myCheck(token) {
        console.log("myyyyyyyyyyyyyyyyyyyyy")
    }
    public behaviors(): any[] {
        return [{
            'authenticator': {
                "class": JwtHttpBearerAuth,
                "except":["index","login"]
                // "auth": this.myCheck
            }
        }]
    }


    // public behaviors(): any[] {
    //
    //     return [{
    //         // 'authenticator': {
    //         //     "class": JwtHttpBearerAuth,
    //         //     // "auth": this.myCheck
    //         // },
    //         'access': {
    //             'class': AccessControl,
    //             'only': ['login', 'logout','index'  ],
    //             'rules': [
    //                 {
    //                     'allow': false,
    //                     'actions': ['login', 'index' ],
    //                     'roles': ['?'],
    //                 },
    //                 {
    //                     'allow': true,
    //                     'actions': ['logout', "logout2"],
    //                     'roles': ['@'],
    //                 }
    //             ]
    //         }
    //     }]
    // }

    @get("index")
    Index(req: Request, res: Response) {

        BaseChyz.logs().info("Site Controller Burası", this.id)
        return res.json({message: "index sayfası"})
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
                // @ts-ignore
                let xForwardedFor = (req.headers['x-forwarded-for'] || '').replace(/:\d+$/, '');
                let ip = xForwardedFor || req.socket.remoteAddress;
                var source: string  = req.headers['user-agent'] || '';
                if (req.headers['x-ucbrowser-ua']) {  //special case of UC Browser
                    source = req.headers['x-ucbrowser-ua']+"";
                }
                token = await JsonWebToken.sign({
                    user: user.id,
                    ip: ip,
                    agent: source,
                }, user.authkey, {expiresIn: '1h'});

                BaseChyz.debug("Db user create access token", username,"expiresIn","1h")
                return res.json({token: token})
            } else {
                let error: any = new ForbiddenHttpException(BaseChyz.t('You are not allowed to perform this action.'))
                res.status(500).json( error.toJSON())
            }
        } else {
            let error: any = new ForbiddenHttpException(BaseChyz.t('You are not allowed to perform this action.'))
            res.status(500).json( error.toJSON())
        }


    }

    @get("logout")
    logout(req: Request, res: Response) {

        // @ts-ignore
        let identity = req.user ?? BaseChyz.getComponent("user").getIdentity();
        // console.log("logout2", identity.id)
        //console.log(identity)

        BaseChyz.logs().info("Logout Controller")
        return res.send("Logout Controller")
    }

    @get("signup")
    logout2(req: Request, res: Response) {


        return res.send("Logout Controller")
    }

    error(req: Request, res: Response) {
        BaseChyz.logs().info("Error Sayfası")
        return res.send("Post Controller")
    }
}
module.exports=SiteController