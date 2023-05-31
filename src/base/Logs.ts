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

export class Logs implements Configurable {

    public name = this.constructor.name;
    public configs: any = require('../log/config/log4js.json') ?? {}


    constructor(name?: string, configs?: any) {
        if (name)
            this.name = name;
        if (configs)
            this.configs = configs;

        this.Provider().configure(this.configs);
    }

    init() {

        this.Provider().configure(this.configs);
    }

    /**
     *
     * @constructor
     */
    public Provider() {
        return log4js;
    }

    public logs(...args: any[]) {
        return log4js.getLogger(this.name);
    }

    public debug(...args: any[]) {
        this.logs().debug(...args)
    }

    public info(...args: any[]) {
        this.logs().info(...args)
    }

    public warn(...args: any[]) {
        this.logs().warn(...args)
    }

    public error(...args: any[]) {
        this.logs().error(...args)
    }

    public fatal(...args: any[]) {
        this.logs().fatal(...args)
    }


    public warning(...args: any[]) {
        this.logs().warn(...args)
    }

}

export default new Logs();
