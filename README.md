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

##index.ts alanlar düzenlenmeli.
```js
let config = {
    components: {
        db:{
            class:DbConnection,
            database: process.env.DBDATABASE,
            username:process.env.DBUSER,
            password:process.env.DBPASS,
            options:{
                host: process.env.DBHOST,
                dialect: 'postgres',  /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
                // disable logging; default: console.log
                logging: false
            }
        },
        user: {
            'class': User,
            'identityClass':Identity
        }
    }
}
Chyz.app(config).Start();
```

##Create Model
Veritabanı işlemleri için model oluşturma, sequelize desteklidir.

```js
import {Model} from "chyz/base/Model";
import {DataTypes} from "sequelize";

export class Customer extends Model {
    public static tableName() {
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

##Yetkilendirme için kullanıcı modeli

```js
import {IdentityInterface} from "chyz/web/IdentityInterface";
// @ts-ignore
import {DataTypes} from "sequelize";
import {Model} from "chyz/base";

export class User extends Model implements IdentityInterface {
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
        let identity = await this.findOne({where: {salt_text: token.signature}});
        return identity;
    }


}



```