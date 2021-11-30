/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
// @ts-ignore


import {DataTypes, Model} from "../../base";

export class UserPermissionClass extends Model {
    [x: string]: any;

    public tableName() {
        return 'user_permissions';
    }


    public attributes() {
        return {
            // Model attributes are defined here
            object_type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            object_value: {
                type: DataTypes.STRING,
                allowNull: false
            }

        }
    }
}

const UserPermission = new UserPermissionClass();
export {UserPermission}