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
export class User extends Model implements IdentityInterface {

    [x: string]: any;

    public tableName() {
        return 'users';
    }

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
        let decoded = JsonWebToken.decode(token, {complete: true})
        let identity = await this.findOne({where: {id: parseInt(decoded.payload.user)}});
        if (identity) {
            BaseChyz.debug("Find Identity By AccessToken: User Found", decoded.payload)
            try {
                JsonWebToken.verify(token, identity.salt_text);
                BaseChyz.debug("Find Identity By AccessToken: User Verify Success")
                return identity;
            } catch (err) {
                if (err.name == "TokenExpiredError")
                    BaseChyz.debug("Find Identity By AccessToken: Token Expired")
                else
                    BaseChyz.debug("Find Identity By AccessToken: User Verify Failed")
                return null;
            }
        }
        BaseChyz.debug("Find Identity By AccessToken: User Verify Failed")
        return null;
    }
}


