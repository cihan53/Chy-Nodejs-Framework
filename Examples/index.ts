/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */


import Chyz from "../Chyz";
import {User} from "../web/User";
import {User as Identity } from "./Models/User";
// @ts-ignore
import {DbConnection} from "../base/DbConnection";


let config = {
    port: 3000,
    controllerpath:"C:\\PROJELER\\github\\Chy-Nodejs-Framework\\Examples\\Controllers",
    components: {
        db:{
            class:DbConnection,
            database: process.env.DBDATABASE,
            username:process.env.DBUSER,
            password:process.env.DBPASS,
            options:{
                host: process.env.DBHOST,
                dialect: 'postgres',  /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
                // disable logging; default: console.log
                logging: false
            }
        },
        user: {
            'class': User,
            'identityClass':Identity
        }
    }
}
Chyz.app(config).Start();