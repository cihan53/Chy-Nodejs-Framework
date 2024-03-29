/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {IdentityInterface} from "../../src/web/IdentityInterface";
import {BaseChyz, Model} from "../../src/";
import {DataTypes} from "../../src/base";

const JsonWebToken = require("jsonwebtoken");

export class User  extends Model implements IdentityInterface {
    [x: string]: any;


    accessChecker: any = null;
    _user: any;
    _access: any = {}


    public tableName() {
        return 'users';
    }

    public attributes() {
        return {
            // Model attributes are defined here
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },

            authkey: {
                type: DataTypes.STRING
                // allowNull defaults to true
            },
            status: {
                type: DataTypes.STRING
                // allowNull defaults to true
            }
        }
    }

    /**
     *
     * @param id
     */
    findIdentity(id: number) {
        throw new Error("Method not implemented.");
    }

    /**
     *
     */
    getId(): number {
        throw new Error("Method not implemented.");
    }

    can(permissionName: string, params: any[], allowCaching: boolean): Promise<boolean | null> {
        return Promise.resolve(null);
    }


    /**
     *
     */
    getAuthKey(): string {
        throw new Error("Method not implemented.");
    }

    validateAuthKey(authKey: string): boolean {
        throw new Error("Method not implemented.");
    }


    async findIdentityByAccessToken(token: any, type: any) {

        let decoded = JsonWebToken.decode(token, {complete: true})
        if (!decoded.payload.user) {
            return null;
        }

        let identity = await this.findOne({where: {id: parseInt(decoded.payload.user)}});
        if (identity) {
            BaseChyz.debug("Find Identity By AccessToken: User Found", decoded.payload)
            try {
                JsonWebToken.verify(token, identity.authkey);
                BaseChyz.debug("Find Identity By AccessToken: User Verify Success")
                return identity;
            } catch (err: any) {
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
