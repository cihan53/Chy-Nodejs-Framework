Hızlı şekilde microservis hazırlama için geliştirmeye başladım

Temel olarak yii2 php framework'ten örnekler alındı

Temel olarak basit bir Controller geliştirildi, ayrıca authentication geliştirildi.

Klasör Yapısı
*---Controllers  
*---Models
*---Log
*---Framework
index.ts

`##Başlangıç
yarn start 

##index.ts alanlar düzenlenmeli.

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


