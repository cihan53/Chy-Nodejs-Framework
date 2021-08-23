/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
// @ts-ignore
const {Sequelize} = require("sequelize");
import {Component} from "./Component";
import BaseChyz from "../BaseChyz";

export class DbConnection extends Component {

    public database!: string;
    public username!: string
    public password!: string
    public options?: object

    private _db: any

    async init() {
        const sequelize = new Sequelize(this.database, this.username, this.password, this.options);
        this._db = sequelize;
        sequelize
            .authenticate()
            .then(() => {
                BaseChyz.info('Connection has been established successfully.');
            })
            .catch((err: any) => {
                BaseChyz.error('Unable to connect to the database:', err);

            });

        // await this.connect();
    }


    get db(): any {
        return this._db;
    }

    set db(value: any) {
        this._db = value;
    }
}