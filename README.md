Hızlı şekilde microservis hazırlama için geliştirmeye başladım<br>

Temel olarak yii2 php framework'ten örnekler alındı<br>

Temel olarak basit bir Controller geliştirildi, ayrıca authentication geliştirildi.<br>

Klasör Yapısı<br>
*---Controllers  <br>
*---Models<br>
*---Log<br>
index.ts<br>

`##Başlangıç<br>
yarn start

## index.ts alanlar düzenlenmeli.

```typescript

import {BaseChyz} from "../index";

require('dotenv-flow').config();
import Chyz ,{  DbConnection, BaseChyz} from "chyz/dist/";
import {AuthManager} from "chyz/dist/rbac/AuthManager"
import {WebUser} from "chyz/dist/web/WebUser";
import {User as Identity} from "./Models/User";


let config = {
    port: process.env.PORT || 8870,
    controllerpath: "Examples\\Controllers",
    components: {
        authManager: {
            class: AuthManager,
        },
        db: {
            class: DbConnection,
            database: process.env.DBDATABASE,
            username: process.env.DBUSER,
            password: process.env.DBPASS,
            options: {
                host: process.env.DBHOST,
                dialect: 'postgres',  /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
                // disable logging; default: console.log
                logging: (msg: any) => BaseChyz.debug(msg)
            }
        },
        user: {
            'class': WebUser,
            'identityClass': User
        }
    }

}
Chyz.app(config).Start();
```

##Controller 
Basit şekilde kontroller oluşturulabilir.
```typescript
/*
 *
 * Copyright (c) 2021-2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

import {AccessControl, BaseChyz, JwtHttpBearerAuth, ModelManager, Request, Response,} from "chyz/dist";
import {ForbiddenHttpException, Model, NotFoundHttpException, ValidationHttpException} from "chyz/dist/base";

import Utils from 'chyz/dist/requiments/Utils';
import {controller, get, post} from "chyz/dist/decorator";
import {Controller} from "chyz/dist/base/Controller";
import * as Util from "util";
import {uid} from "uid";

import {User} from "../Models/User";
import {AuthManager} from "../Lib/AuthManager";
import {CategoriesClass} from "../Models/Categories";


const keygen = require('ssh-keygen');
const os = require('os');
const bcrypt = require('bcrypt');
const JsonWebToken = require("jsonwebtoken");
const {Op} = require("sequelize");


@controller("/api")
class ApiController extends Controller {

    public myCheck(token) {
        console.log("myyyyyyyyyyyyyyyyyyyyy")
    }

    public behaviors(): any[] {

        return [{
            'authenticator': {
                "class": JwtHttpBearerAuth,
                // "auth": this.myCheck
            },
            'access': {
                'class': AccessControl,
                'only': ['order/list' ],
                'rules': [

                    {
                        'allow': true,
                        'actions': ['order/list' ],
                        'roles': ['editor'],
                    }
                ]
            }
        }]
    }

    @get("/")
    Index(req: Request, res: Response) {

        BaseChyz.logs().info("Site Controller Burası", this.id)
        return res.json({message: "index sayfası"})
    }

    @post("orderCreate")
    async Login(req: Request, res: Response) {
        let data = req.body;
        data.Customer.status = "true";

        //Customer Model Create
        let customer = ModelManager.Customer.save();
        //Order Model Create
        let order = ModelManager.Order;


        let transaction
        try {
            // get transaction
            transaction = await BaseChyz.getComponent("db").transaction();
            customer.load(data, "Customer");//load customer data
            let cus: any = await customer.save({}, {transaction});

            if (!cus) {
                throw new ValidationHttpException(customer.errors);
            }

            data.Order.customer_id = cus.id;
            
            order.load(data, "Order");
            let res1 = await order.save({}, {transaction});
            if (!res1) {
                throw new ValidationHttpException(order.errors);
            }

            // commit
            await transaction.commit();

        } catch (e) {
            if (transaction) {
                await transaction.rollback();
                BaseChyz.warn("Rollback transaction")
            }

            if (e instanceof ValidationHttpException)
                throw new ValidationHttpException(e.message)
            else
                throw new ForbiddenHttpException(e.message)
        }
        return res.send("Post Controller")
    }


    @get("order/list")
    async listOrder(req: Request, res: Response) {
        const {Products}: { Products: ProductsClass } = ModelManager;
        let product = await Products.findAll( );
        return res.json(product)

    }

    @get("categories")
    async Categories(req: Request, res: Response) {
        let product = await ModelManager.Categories.findAll({
            include: [
                {
                    model: ModelManager.Products.model(),
                }
            ]
        });
        return res.json(product)

    }

    error(req: Request, res: Response) {
        BaseChyz.logs().info("Error Sayfası")
        return res.send("Post Controller")
    }
}

module.exports = ApiController

```


## Create Model

Veritabanı işlemleri için model oluşturma, sequelize desteklidir.

Model adı "**Class**" şeklinde bitmeli.

Örnek = "ModelName**Class**" 

```typescript
import {Model, DataTypes} from "chyz/base/Model";

export class CustomerCLass extends Model {
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
````typescript

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
                type: "hasOne",
                foreignKey: "id",
                sourceKey: "customer_id",
                model: Customer.model()
            }
        ]
    }
}

/**
 * 
 */
export class CategoriesClass extends Model {
    [x: string]: any;

    alias() {
        return "c"
    }

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
                as: 'product',
                model: ModelManager.Products.model(),
                through: ModelManager.ProductToCategories.model()
            }
        ]
    }

}

 
````

## Http POST ve GET verilerini model'e yükleme

````typescript

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
import {  ModelManager} from "chyz/dist";
import {Customer} from "./Customer";

//Customer Model Create
let customer: Customer = ModelManager.Customer;
customer.load(req.body, "Customer");//load customer data
let cus: any = await customer.save();


````
## Transaction
Transaction oluşturma


```typescript
    let transaction
    try {
        // get transaction
        transaction = await BaseChyz.getComponent("db").transaction();
        //Customer Model Create
        let customer: Customer = ModelManager.Customer;
        customer.load(data, "Customer");//load customer data
        let cus: any = await customer.save({}, {transaction});
        if (!cus) {
            throw new ValidationHttpException(customer.errors);
        }
    } catch (e) {
        if (transaction) {
            await transaction.rollback();
            BaseChyz.warn("Rollback transaction");
        }
        
    }
```

## Yetkilendirme için kullanıcı modeli

```typescript
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

    /**
     * Returns auth manager associated with the user component.
     *
     * By default this is the `authManager` application component.
     * You may override this method to return a different auth manager instance if needed.
     */
    protected getAuthManager() {
        return BaseChyz.getComponent("authManager");
    }

    /**
     * Returns the access checker used for checking access.
     * @return CheckAccessInterface
     */
    protected getAccessChecker() {
        return this.accessChecker !== null ? this.accessChecker : this.getAuthManager();
    }
    
    /**
     *
     * @param permissionName
     * @param params
     * @param allowCaching
     */
    public async can(permissionName, params: any[] = [], allowCaching: boolean = true) {
        let accessChecker;
        if ((accessChecker = this.getAccessChecker()) === null) {
            return false;
        }

        let access = await accessChecker.checkAccess(this.getId(), permissionName, params);
        this._access[permissionName] = access;
        if (allowCaching && Utils.isEmpty(params)) {

        }
        return access;
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
        if (!decoded.payload.user) {
            return null;
        }
        let identity = await this.findOne({where: {id: parseInt(decoded.payload.user)}});
        if(identity){
            BaseChyz.debug("Find Identity By AccessToken: User Found", decoded.payload)
            try {
                JsonWebToken.verify(token, identity.salt_text);
                this.setIdentity(identity);
                BaseChyz.debug("Find Identity By AccessToken: User Verify Success")
                return this;
            } catch(err) {
                if (err.name == "TokenExpiredError")
                    BaseChyz.debug("Find Identity By AccessToken: Token Expired")
                else
                    BaseChyz.debug("Find Identity By AccessToken: User Verify Failed")
                return null;
            }
        }
        BaseChyz.debug("Find Identity By AccessToken: User Verify Failed")
        return null;
    }


}



```
