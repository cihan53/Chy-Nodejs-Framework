/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import {DataTypes, Model, Relation} from "../../base";
import {Products} from "./Products";

export class Models extends Model {
    [x: string]: any;

    tableName() {
        return 'models';
    }


    attributes() {
        return {
            // Model attributes are defined here
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            stock_code: {
                type: DataTypes.STRING,
                allowNull: false
            },
            properties: {
                type: DataTypes.STRING,
                allowNull: false
            }

        }
    }

    // relation(): Relation[] {
    //     return [
    //         {
    //             type: "hasOne",
    //             foreignKey: "id",
    //             sourceKey:"category_id",
    //             model:(new Products()).model()
    //         }
    //     ]
    // }
}

