/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import {DataTypes, ModelManager, Model, Relation} from "../../base";

export class ProductToCategoriesClass extends Model {
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
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }

        }
    }

    // relations(): Relation[] {
    //     return [
    //         {
    //             type: "hasMany",
    //             foreignKey: "category_id",
    //             sourceKey: "id",
    //             model: ModelManager.Categories.model(),
    //         }
    //     ]
    // }

}

// const ProductToCategories = new ProductToCategoriesClass()
// export {ProductToCategories}