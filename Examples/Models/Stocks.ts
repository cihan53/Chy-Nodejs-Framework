/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import {DataTypes, Model} from "../../base";

export class StocksClass extends Model {
    [x: string]: any;

    public tableName() {
        return 'stock';
    }

    /**
     * product_id int4
     * properties jsonb
     * status int2
     * barcode string(20)
     * stock_code string(20)
     * model_id int4
     */
    public attributes() {
        return {
            // Model attributes are defined here
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            barcode: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: 20
                }
            },
            stock_code: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: 20
                }
            },
            model_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false
            }

        }
    }
}

// const Stocks = new StocksClass();
// export {Stocks}