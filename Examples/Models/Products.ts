/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import {DataTypes, ModelManager, Model, Relation} from "../../base";


export class ProductsClass extends Model {
    [x: string]: any;

    tableName() {
        return 'products';
    }

    attributes() {
        return {
            // Model attributes are defined here
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            model_id: {
                type: DataTypes.INTEGER,
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
                foreignKey: "product_id",
                sourceKey: "id",
                model: ModelManager.Categories.model(),
                through: ModelManager.ProductToCategories.model()
            }
        ]
    }
}

// const Products = new ProductsClass()
// export {Products}