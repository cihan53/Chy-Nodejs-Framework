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
import {AccessControl} from "../../filters/AccessControl";
import {JwtHttpBearerAuth} from "../../filters/auth/JwtHttpBearerAuth";
import Utils from "../../requiments/Utils";

@controller("/site")
class SiteController extends Controller {

    public myCheck(token) {
        console.log("myyyyyyyyyyyyyyyyyyyyy")
    }

    public behaviors(): any[] {

        return [{
            // 'authenticator': {
            //     "class": JwtHttpBearerAuth,
            //     // "auth": this.myCheck
            // },
            'access': {
                'class': AccessControl,
                'only': ['login', 'logout','index'  ],
                'rules': [
                    {
                        'allow': false,
                        'actions': ['login', 'index' ],
                        'roles': ['?'],
                    },
                    {
                        'allow': true,
                        'actions': ['logout', "logout2"],
                        'roles': ['@'],
                    }
                ]
            }
        }]
    }

    @get("index")
    Index(req: Request, res: Response) {

        BaseChyz.logs().info("Site Controller Burası", this.id)
        return res.json({message: "index sayfası"})
    }

    @post("login")
    Login(req: Request, res: Response) {
        BaseChyz.logs().info("Post Controller")
        return res.send("Post Controller")
    }

    @get("logout")
    logout(req: Request, res: Response) {

        // @ts-ignore
        let identity = req.user ?? BaseChyz.getComponent("user").getIdentity();
        // console.log("logout2", identity.id)
        console.log(identity)

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