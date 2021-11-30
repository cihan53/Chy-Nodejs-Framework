/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import {DataTypes, Model, Relation} from "../../base";

export class ProductToCategories extends Model {
    [x: string]: any;

    tableName() {
        return 'product_to_categories';
    }


    attributes() {
        return {
            // Model attributes are defined here
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            categories_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }

        }
    }

}