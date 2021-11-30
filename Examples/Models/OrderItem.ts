import {DataTypes, Model} from "../../base";

export class OrderItem extends Model {
    [x: string]: any;

    public tableName() {
        return 'order_items';
    }

    public attributes() {
        return {

            status: {
                type: DataTypes.BOOLEAN,
                validate: {
                    isBoolean: true
                }
            }
        }
    }

}




