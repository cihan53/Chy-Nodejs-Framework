/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import {DataTypes, ModelManager, Model, Relation} from "../../base";
import {ProductToCategoriesClass} from "./ProductToCategories";

export class CategoriesClass extends Model {
    [x: string]: any;

    tableName() {
        return 'categories';
    }


    attributes() {
        return {
            // Model attributes are defined here
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            properties: {
                type: DataTypes.STRING,
                allowNull: false
            }

        }
    }

    relations(): Relation[] {
        return [
            {
                type: "belongsToMany",
                foreignKey: "category_id",
                sourceKey: "id",
                model: ModelManager.Products.model(),
                through: ModelManager.ProductToCategories.model()
            }
        ]
    }

}

// const Categories = new CategoriesClass();
// export {Categories};