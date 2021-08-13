/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
// @ts-ignore
import {Sequelize} from "sequelize";
import {Component} from "./Component";
import BaseChyz from "../BaseChyz";

export class DbConnection extends Component {

    public database: string
    public username: string
    public password: string
    public options?: object

    private _db: any

    async init() {
        const sequelize = new Sequelize(this.database, this.username, this.password, this.options);
        this._db = sequelize;
        // await this.connect();
    }


    connect = async () => {
        try {
            await this._db.authenticate();
            BaseChyz.debug('Connection has been established successfully.');
        } catch (error) {
            BaseChyz.error('Unable to connect to the database:', error);
        }

    }

    get db(): any {
        return this._db;
    }

    set db(value: any) {
        this._db = value;
    }
}