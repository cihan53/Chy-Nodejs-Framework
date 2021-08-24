Hızlı şekilde microservis hazırlama için geliştirmeye başladım<br>

Temel olarak yii2 php framework'ten örnekler alındı<br>

Temel olarak basit bir Controller geliştirildi, ayrıca authentication geliştirildi.<br>

Klasör Yapısı<br>
*---Controllers  <br>
*---Models<br>
*---Log<br>
*---Framework<br>
index.ts<br>

`##Başlangıç<br>
yarn start

## index.ts alanlar düzenlenmeli.

```js
let config = {
    components: {
        db: {
            class: DbConnection,
            database: process.env.DBDATABASE,
            username: process.env.DBUSER,
            password: process.env.DBPASS,
            options: {
                host: process.env.DBHOST,
                dialect: 'postgres',  /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
                // disable logging; default: console.log
                logging: false
            }
        },
        user: {
            'class': User,
            'identityClass': Identity
        }
    }
}
Chyz.app(config).Start();
```

## Create Model

Veritabanı işlemleri için model oluşturma, sequelize desteklidir.

```js
import {Model, DataTypes} from "chyz/base/Model";

export class Customer extends Model {
    public tableName() {
        return 'customer';
    }

    public attributes() {
        return {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [4, 255],
                }
            },
            email: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: true
                }
            },
            firstname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastname: {
                type: DataTypes.STRING,
            },
        }
    }

}
```
## Http POST ve GET verilerini model'e yükleme
````js

    /**
     * post data
     *  {
     *      "Customer":{
     *          "firstname":"cihan",
     *          "lastname":"ozturk"
     *          ....
     *      }
     *  }
     * @type {Customer}
     */

    //Customer Model Create
    let customer: Customer = new Customer();
    customer.load(req.body, "Customer");//load customer data
    let cus: any = await customer.save();
        
        
        

````
## Transaction
Transaction oluşturma


```js
    let transaction
    try {
        // get transaction
        transaction = await BaseChyz.getComponent("db").transaction();
        //Customer Model Create
        let customer: Customer = new Customer();
        customer.load(data, "Customer");//load customer data
        let cus: any = await customer.save({}, {transaction});
        if (!cus) {
            throw new ValidationHttpException(customer.errors);
        }
    } catch (e) {
        if (transaction) {
            await transaction.rollback();
            BaseChyz.warn("Rollback transaction")
        }
        ...
    }
```

## Yetkilendirme için kullanıcı modeli

```js
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import {IdentityInterface} from "chyz/web/IdentityInterface";
// @ts-ignore
import {DataTypes} from "chyz/base";
import {Model} from "chyz/base";
import BaseChyz from "chyz/BaseChyz";

const bcrypt = require('bcrypt');
const JsonWebToken = require("jsonwebtoken");

export class User extends Model implements IdentityInterface {
    public tableName() {
        return 'users';
    }
    findIdentity(id: number) {
        throw new Error("Method not implemented.");
    }

    getId(): number {
        throw new Error("Method not implemented.");
    }

    getAuthKey(): string {
        throw new Error("Method not implemented.");
    }

    validateAuthKey(authKey: string): boolean {
        throw new Error("Method not implemented.");
    }

    public attributes() {
        return {
            // Model attributes are defined here
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            user_role: {
                type: DataTypes.STRING,
                allowNull: false
            },
            salt_text: {
                type: DataTypes.STRING
                // allowNull defaults to true
            }
        }
    }

    async findIdentityByAccessToken(token, type) {
        let decoded = JsonWebToken.decode(token, {complete: true})
        let identity = await this.findOne({where: {id: parseInt(decoded.payload.user)}});
        if(identity){
            BaseChyz.debug("Find Identity By AccessToken: User Found", decoded.payload)
            try {
                JsonWebToken.verify(token, identity.salt_text);
                BaseChyz.debug("Find Identity By AccessToken: User Verify Success")
                return identity;
            } catch(err) {
                BaseChyz.debug("Find Identity By AccessToken: User Verify Failed")
                return null;
            }
        }
        BaseChyz.debug("Find Identity By AccessToken: User Verify Failed")
        return null;
    }


}






```