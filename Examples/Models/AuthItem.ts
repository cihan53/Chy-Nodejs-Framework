/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */



import {DataTypes, Model, ModelManager, Relation} from "../../base";

export class AuthItemClass extends Model {
    [x: string]: any;

    tableName() {
        return 'auth_item';
    }

    attributes() {
        return {
            // Model attributes are defined here
            name: {
                type: DataTypes.STRING,
                primaryKey:true,
                allowNull: false
            },
            type: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            rule_name: {
                type: DataTypes.STRING,
                allowNull: false
            }

        }
    }

    init() {
        super.init();
        this.model().removeAttribute('id')
    }

    // relations(): Relation[] {
    //     return [
    //         {
    //             type: "hasOne",
    //             foreignKey: "item_name",
    //             model: ModelManager.AuthAssignment.model()
    //         }
    //     ]
    // }

}

