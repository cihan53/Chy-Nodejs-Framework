/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */


import Chyz, {BaseChyz, DbConnection, Logs, WebUser} from "../src";
import {User} from "./Models/User";


//
//
require('dotenv-flow').config();
//
//
//
let config = {
    port: process.env.PORT,
    controllerpath: process.env.CONTROLLER_PATH,
    logs: new Logs('Examples', require('./log4js.json')),
    staticFilePath:'C:\\PROJELER\\github\\Chy-Nodejs-Framework\\Examples',
    components: {
        db: {
            class: DbConnection,
            database: process.env.DBDATABASE,
            username: process.env.DBUSER,
            password: process.env.DBPASS,
            options: {
                host: process.env.DBHOST,
                port: process.env.DBPORT ||  '5432',
                dialect: 'postgres',  /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
                // disable logging; default: console.log
                // logging: false
                logging: (msg: any) => BaseChyz.debug(msg)
            }
        },
        // db: {
        //     class: DbConnection,
        //     database: process.env.DBDATABASE,
        //     username: process.env.DBUSER,
        //     password: process.env.DBPASS,
        //
        //     options: {
        //         host: process.env.DBHOST,
        //         dialect: 'postgres',  /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
        //         // disable logging; default: console.log
        //         logging: (msg: any) => BaseChyz.debug(msg)
        //     }
        // },
        // db2: {
        //     class: DbConnection,
        //     database: process.env.DBDATABASE,
        //     username: process.env.DBUSER,
        //     password: process.env.DBPASS,
        //     options: {
        //         host: process.env.DBHOST,
        //         dialect: 'postgres',  /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
        //         // disable logging; default: console.log
        //         logging: (msg: any) => BaseChyz.debug('DB2', msg)
        //     }
        // },
        // authManager: {
        //     class: AuthManager,
        // },
        user: {
            'class': WebUser,
            'identityClass': User
        }
    }

}
Chyz.app(config).Start();
