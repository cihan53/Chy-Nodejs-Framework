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

@controller("/api")
class ApiController extends Controller {

    public myCheck(token) {
        console.log("myyyyyyyyyyyyyyyyyyyyy")
    }

    public behaviors(): any[] {

        return [{
            'authenticator': {
                "class": JwtHttpBearerAuth,
                // "auth": this.myCheck
            },
            'access': {
                'class': AccessControl,
                'only': ['login', 'logout', 'signup'],
                'rules': [
                    {
                        'allow': true,
                        'actions': ['login', 'index'],
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

    @get("/")
    Index(req: Request, res: Response) {

        BaseChyz.logs().info("Site Controller Burası", this.id)
        return res.json({message: "index sayfası"})
    }

    @post("login")
    Login(req: Request, res: Response) {
        BaseChyz.logs().info("Post Controller")
        return res.send("Post Controller")
    }





    error(req: Request, res: Response) {
        BaseChyz.logs().info("Error Sayfası")
        return res.send("Post Controller")
    }
}
module.exports=ApiController