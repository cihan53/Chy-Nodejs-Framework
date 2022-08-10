/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import Chyz ,{WebUser} from "chyz";
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
    components: {
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
