/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
require('dotenv-flow').config();
import Chyz, {BaseChyz, DbConnection, Logs, WebUser} from "../src/";
import {User} from "./Models/User";
import {AuthManager} from "../src//rbac/AuthManager";

let config = {
    port: process.env.PORT,
    controllerpath: process.env.CONTROLLER_PATH,
    logs: new Logs('Examples', require('./log4js.json')),
    staticFilePath:__dirname,
    components: {
        authManager: {
            class: AuthManager
        },
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
Chyz.app(config).then(server=>server.Start());
// process
//     .on('unhandledRejection', (reason, p) => {
//         BaseChyz.fatal(reason, 'Unhandled Rejection at Promise', p);
//     })
//     .on('uncaughtException', err => {
//         BaseChyz.fatal(err, 'Uncaught Exception thrown');
//         // process.exit(1);
//     });
