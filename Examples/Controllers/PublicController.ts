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

@controller("/public")
class PublicController extends Controller {

    public myCheck(token) {
        console.log("myyyyyyyyyyyyyyyyyyyyy")
    }

    public behaviors(): any[] {

        return [ ]
    }

    @get("/")
    Index(req: Request, res: Response) {

        BaseChyz.logs().info("Site Controller Burası", super.id)
        return res.json({message: "index sayfası"})
    }


    error(req: Request, res: Response) {
        BaseChyz.logs().info("Error Sayfası")
        return res.send("Post Controller")
    }
}
module.exports=PublicController