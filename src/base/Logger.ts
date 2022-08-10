/*
 *
 * Copyright (c) 2022.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

import {Configurable} from "./Configurable";

const log4js = require("log4js");

export class Logger implements Configurable {

    public configs: any = require('./log/config/log4js.json') ?? {}

    init() {

    }

    /**
     *
     * @constructor
     */
    Provider() {
        return log4js;
    }

    static logs(...args: any[]) {
        return log4js.getLogger(this.name);
    }

    public static debug(...args: any[]) {
        Logger.logs().debug(...arguments)
    }

    public static info(...args: any[]) {
        Logger.logs().info(...arguments)
    }

    public static warn(...args: any[]) {
        Logger.logs().warn(...arguments)
    }

    public static error(...args: any[]) {
        Logger.logs().error(...arguments)
    }

    public static fatal(...args: any[]) {
        Logger.logs().fatal(...arguments)
    }


    public static warning(...args: any[]) {
        Logger.logs().warn(...arguments)
    }

}
