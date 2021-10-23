import {DataTypes, Model} from "../../Chy-Nodejs-Framework/dist/base";

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




