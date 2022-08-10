/*
 *
 * Copyright (c) 2022.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

declare namespace Express {
    export interface Request {
        identity?: string
    }
}

import { Express } from "express-serve-static-core"
declare module "express-serve-static-core" {
    interface Request {
        identity: any;
    }
}
