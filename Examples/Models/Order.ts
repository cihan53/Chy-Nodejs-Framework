import {DataTypes, Model, Relation} from "../../base";
import {OrderItem} from "./OrderItem";

export class Order extends Model {
    [x: string]: any;

    tableName() {
        return 'order';
    }

    attributes() {

        return {
            customer_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },

            crm_order_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },

            total: {
                allowNull: false,
                type: DataTypes.FLOAT,
            },

            created_date: {
                allowNull: false,
                type: DataTypes.DATE,
                // @ts-ignore
                defaultValue: Model.NOW
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                validate: {
                    isBoolean: true
                }
            }
        }
    }


    relation(): Relation[] {
        return [
            {
                type: "hasOne",
                sourceKey: "order_id",
                foreignKey: "id",
                model: (new OrderItem()).model()
            }
        ]
    }
}




