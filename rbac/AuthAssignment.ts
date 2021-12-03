/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {DataTypes, Model, ModelManager, Relation} from "../base";

export class AuthAssignmentClass extends Model {
    [x: string]: any;

    tableName() {
        return 'auth_assignment';
    }
    attributes() {
        return {

            // Model attributes are defined here
            item_name: {
                type: DataTypes.STRING,
                primaryKey:true,
                allowNull: false
            },
            user_id : {
                type: DataTypes.STRING,
                allowNull: false
            }

        }
    }

    init(){
        super.init();
        this.model().removeAttribute('id')
    }

    relations(): Relation[] {
        return [
            {
                type: "hasMany",
                foreignKey: "name",
                sourceKey:'item_name',
                model: ModelManager.AuthItem.model()
            }
        ]
    }

}

