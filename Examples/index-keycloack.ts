/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */


require('dotenv-flow').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import Chyz from "../Chyz";
import {WebUser} from "../web/WebUser";
import {KeycloakUser as Identity} from "./Models/KeycloakUser";
// @ts-ignore
import {DbConnection} from "../base/DbConnection";

var Keycloak = require('keycloak-connect');
var session = require('express-session');
var memoryStore = new session.MemoryStore();


var keycloakConfig = {
    "realm": "CameraBox",
    "auth-server-url": "https://keycloak.hubbox.io:8080/auth/",
    //"ssl-required": "external",
    "resource": "izanami",
    "verify-token-audience": true,
    "bearerOnly": true,
    "confidential-port":0,
    "policy-enforcer":{},
    "credentials": {
        "secret": "0b476571-28ab-49b1-9968-90fce6294d5a"
    }

};



Keycloak.prototype.accessDenied = function () {
    return null;
}

var keycloak = new Keycloak({scope: 'offline_access'}, keycloakConfig);


let config = {
    port: 3000,
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
                logging: false
            }
        },
        user: {
            'class': WebUser,
            'identityClass': Identity
        }
    },
    middlewares: {
        keycloak: {
            keycloak: keycloak,
            config: {
                logout: '/logout'
            }
        }
    }
}
Chyz.app(config).Start();