/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {IdentityInterface} from "../../web/IdentityInterface";
// @ts-ignore
import {DataTypes, Model} from "sequelize";
import BaseChyz from "../../BaseChyz";

export class User implements IdentityInterface {

    private _model  ;

    constructor() {
        const sequelize = BaseChyz.getComponent("db").db;
        this._model = sequelize.define('User', {
            // Model attributes are defined here
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            user_role: {
                type: DataTypes.STRING,
                allowNull: false
            },
            salt_text: {
                type: DataTypes.STRING
                // allowNull defaults to true
            }
        }, {
            tableName: 'users',
            timestamps: false
        });
    }


    get model(): any {
        return this._model;
    }

    findIdentity(id) {
    }

    async findIdentityByAccessToken(token, type) {
         let identity = await this._model.findOne({where: {salt_text: token.signature}});
         return identity;
    }

    getAuthKey(): string {
        return "";
    }

    getId(): number {
        return 0;
    }

    validateAuthKey(authKey: string): boolean | null {
        return undefined;
    }
}


