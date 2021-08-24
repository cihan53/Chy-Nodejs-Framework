// @ts-ignore
import {DataTypes, Model} from "../../base";

export class Customer extends Model {
    [x: string]: any;

    public tableName() {
        return 'customer';
    }

    public attributes() {
        return {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    is: ["^[a-z0-9A-Z]+$",'i'],
                    len: [4, 255],
                }
            },
            firstname: {
                type: DataTypes.STRING,
                validate: {
                    is: ["^[a-z0-9A-Z]+$",'i'],
                    len: [4, 255],
                }
            },
            lastname: {
                type: DataTypes.STRING,
                validate: {
                    is: ["^[a-z0-9A-Z]+$",'i'],
                    len: [4, 255],
                }
            },
            companyName: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    is: /^[0-9A-Za-z =().:;+-şŞçÇöÖğĞıİüÜ]+$/i,
                    len: [4, 255],
                }
            },
            email: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: true
                }
            },
            gsm_phone: {
                type: DataTypes.STRING,
                validate: {
                    is: ["^[0-9 +]+$",'i'],
                }
            },
            country: {
                type: DataTypes.STRING,
                validate: {
                    isAlpha: true,
                }
            },
            address: {
                type: DataTypes.STRING,
                validate: {
                    is: ["^[\\w'\\-,.[0-9_\\/\\\\+=\"()<>;:\\[\\] şŞçÇöÖğĞıİüÜ  ]{2,}$","i"],
                }
            },
            taxoffice: {
                type: DataTypes.STRING,
                validate: {
                    is: ["^[\\w'\\-,.[0-9_\\/\\\\+=\"()<>;:\\[\\] şŞçÇöÖğĞıİüÜ  ]{2,}$","i"],
                }
            },
            taxnumber: {
                unique: true,
                type: DataTypes.STRING,
                validate: {
                    is:["^[0-9]+$",'i'],
                }
            },
            username: {
                unique: true,
                type: DataTypes.STRING,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?\.#&])[A-Za-z\d$@$!%*\.?&]{8,12}/
                }
            },
            "2fa": {
                type: DataTypes.BOOLEAN,
                validate: {
                    isBoolean: true
                }
            },
            status: {
                type: DataTypes.BOOLEAN,
                validate: {
                    isBoolean: true
                }
            }
        }
    }

}




