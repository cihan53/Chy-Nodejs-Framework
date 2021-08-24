import {DataTypes, Model} from "../../base";

export class Order extends Model {
    [x: string]: any;

    public tableName() {
        return 'order';
    }

    public attributes() {

        return {
            customer_id:{
                allowNull:false,
                type:DataTypes.INTEGER,
            },

            crm_order_id:{
                allowNull:false,
                type:DataTypes.INTEGER,
            },

            total:{
                allowNull:false,
                type:DataTypes.FLOAT,
            },

            created_date:{
                allowNull:false,
                type:DataTypes.DATE,
                // @ts-ignore
                defaultValue: Model.NOW
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull:false,
                validate: {
                    isBoolean: true
                }
            }
        }
    }

}




