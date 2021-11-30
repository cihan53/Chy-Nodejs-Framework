/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {IdentityInterface} from "../../web/IdentityInterface";
import {DataTypes, Model} from "../../base";
import BaseChyz from "../../BaseChyz";

const JsonWebToken = require("jsonwebtoken");

export class KeycloakUser implements IdentityInterface {

    [x: string]: any;


    findIdentity(id: number) {
        throw new Error("Method not implemented.");
    }

    getId(): number {
        throw new Error("Method not implemented.");
    }

    getAuthKey(): string {
        throw new Error("Method not implemented.");
    }

    validateAuthKey(authKey: string): boolean {
        throw new Error("Method not implemented.");
    }

    public attributes() {
        return {
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
        }
    }

    async findIdentityByAccessToken(token, type) {
        console.log(token,type)
        // console.log(this)
        // console.log(BaseChyz)
        return null;
        // return keycloak.protect('realm:user');
    }
}


