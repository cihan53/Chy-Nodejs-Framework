/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */


import {BaseChyz} from "../index";
require('dotenv-flow').config();
import Chyz from "../Chyz";
import {WebUser} from "../web/WebUser";
import {User} from "./Models/User";
import {DbConnection} from "../base";


let config = {
    port: process.env.PORT,
    controllerpath: "C:\\PROJELER\\github\\Chy-Nodejs-Framework\\Examples\\Controllers",
    components: {
        db: {
            class: DbConnection,
            database: process.env.DBDATABASE,
            username: process.env.DBUSER,
            password: process.env.DBPASS,
            options: {
                host: process.env.DBHOST,
                dialect: 'postgres',  /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
                // disable logging; default: console.log
                logging: (msg: any) => BaseChyz.debug(msg)
            }
        },
        user: {
            'class': WebUser,
            'identityClass': User
        }
    }

}
Chyz.app(config).Start();