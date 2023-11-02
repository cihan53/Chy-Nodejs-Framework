/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {Utils} from "../requiments/Utils";

/**
 *  10.4  Client Error 4xx ............................................65
 *    10.4.1    400 Bad Request .........................................65
 *    10.4.2    401 Unauthorized ........................................66
 *    10.4.3    402 Payment Required ....................................66
 *    10.4.4    403 Forbidden ...........................................66
 *    10.4.5    404 Not Found ...........................................66
 *    10.4.6    405 Method Not Allowed ..................................66
 *    10.4.7    406 Not Acceptable ......................................67
 *    10.4.8    407 Proxy Authentication Required .......................67
 *    10.4.9    408 Request Timeout .....................................67
 *    10.4.10   409 Conflict ............................................67
 *    10.4.11   410 Gone ................................................68
 *    10.4.12   411 Length Required .....................................68
 *    10.4.13   412 Precondition Failed .................................68
 *    10.4.14   413 Request Entity Too Large ............................69
 *    10.4.15   414 Request-URI Too Long ................................69
 *    10.4.16   415 Unsupported Media Type ..............................69
 *    10.4.17   416 Requested Range Not Satisfiable .....................69
 *    10.4.18   417 Expectation Failed ..................................70
 */
export class BaseError extends Error {
    statusCode: number;
    orginal: any;
    private readonly success: boolean;

    constructor(message: any, statusCode = 500) {
        super(message);

        this.success = false;
        this.message = Utils.isString(message) ? message : JSON.stringify(message);
        this.name = this.constructor.name // good practice
        this.statusCode = statusCode // error code for responding to client
        //Error.captureStackTrace(this)
        this.orginal = Utils.isString(message) ? message : message
    }

    toString() {
        return `${this.name}[${this.statusCode}] ${this.message}`
    }

    toJSON() {
        if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "dev") {
            return {success: this.success, code: this?.statusCode, name: this.name.toString(),
                message: this.message.toString(),
                stack: this.stack,
                orginal: this.orginal
            }
        } else {
            return {success: this.success, code: this?.statusCode, name: this.name.toString(),
                message: this.message.toString()
            }
        }

    }
}

