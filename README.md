# Chyz Framework (Chy-Nodejs-Framework)

[![npm version](https://img.shields.io/npm/v/chyz.svg?style=flat-square)](https://www.npmjs.com/package/chyz)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

**Chyz** is an enterprise-grade, modular, decorator-driven Node.js & TypeScript microservice framework inspired by the battle-tested architecture of the **Yii2 PHP Framework**. It combines the agility of Express with strong object-oriented principles, declarative routing decorators, Active-Record-style Sequelize models, hierarchical Role-Based Access Control (RBAC), and pluggable authentication behaviors.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Architecture Overview](#-architecture-overview)
- [Installation](#-installation)
- [TypeScript Configuration](#-typescript-configuration)
- [Recommended Directory Structure](#-recommended-directory-structure)
- [Quick Start](#-quick-start)
- [Core Concepts & Detailed Guide](#-core-concepts--detailed-guide)
  - [1. Application Configuration & Bootstrapping](#1-application-configuration--bootstrapping)
  - [2. Decorator-Driven Controllers](#2-decorator-driven-controllers)
  - [3. Multiple Controller Prefixes (Multi-Versioning)](#3-multiple-controller-prefixes-multi-versioning)
  - [4. Behaviors & Action Filters](#4-behaviors--action-filters)
  - [5. Active Record Models & ModelManager](#5-active-record-models--modelmanager)
  - [6. Model Validation & Safe Attribute Loading](#6-model-validation--safe-attribute-loading)
  - [7. Database Transactions](#7-database-transactions)
  - [8. Identity Management & Authentication](#8-identity-management--authentication)
  - [9. Role-Based Access Control (RBAC)](#9-role-based-access-control-rbac)
  - [10. Keycloak SSO / OIDC Integration](#10-keycloak-sso--oidc-integration)
  - [11. Lifecycle Events (CEvents)](#11-lifecycle-events-cevents)
  - [12. Enterprise Logging (log4js)](#12-enterprise-logging-log4js)
  - [13. Exception Handling Hierarchy](#13-exception-handling-hierarchy)
- [API Reference](#-api-reference)
- [Development & Scripts](#-development--scripts)
- [License & Authors](#-license--authors)

---

## 🚀 Key Features

- **Component-Based Architecture**: Modular configuration matching Yii2's service locator pattern (`BaseChyz.getComponent(...)`).
- **Declarative Decorator Routing**: Intuitive HTTP routing with `@controller`, `@get`, `@post`, `@put`, `@delete`, and `@Middleware`.
- **Multiple Prefix Support**: Seamlessly bind a single controller to multiple API prefixes/versions simultaneously (e.g., `/api/subaccount` and `/api/v4/subaccount`).
- **Action Filters & Behaviors**: Clean request interception with `beforeAction`, `afterAction`, `AccessControl`, and authenticators.
- **Built-in Authentication Strategies**:
  - `JwtHttpBearerAuth`: Token-based JWT Bearer authentication.
  - `KeyCloakHttpBearerAuth`: Enterprise OpenID Connect / Keycloak integration.
  - `HttpBearerAuth`: Generic bearer token authentication.
  - `HttpBasicAuth`: Standard HTTP Basic authentication.
  - `HttpHeaderAuth`: API key / custom header authentication.
- **Active Record ORM Layer**: Powerful `Model` base class wrapping Sequelize, supporting schema definitions, relations (`hasOne`, `hasMany`, `belongsTo`, `belongsToMany`), hooks, and validation.
- **Auto-Discovery via `ModelManager`**: Automatically scans and registers models into a global, type-accessible registry.
- **Hierarchical RBAC Engine**: Database-backed Role-Based Access Control with roles, permissions, child relationships, and dynamic business rule checks.
- **Safe Data Loading (`load()`)**: Mass-assignment protection and form scoping inspired by Yii2.
- **Unified Event Dispatcher (`CEvents`)**: Subscribe to framework lifecycle stages (`ON_INIT_BEFORE`, `ON_BEFORE_ACTION`, `ON_START`, etc.).
- **Enterprise Diagnostics**: Multi-appender logging powered by `log4js`.
- **Production-Ready Middlewares**: Integrated Gzip compression, CORS, Body-Parser (JSON & URL-encoded), Method-Override, and SSL/HTTPS support.

---

## 🏛️ Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │            Incoming HTTP             │
                      └──────────────────┬───────────────────┘
                                         ▼
                      ┌──────────────────────────────────────┐
                      │    Express Engine & Global Middlewares│
                      │   (CORS, Compression, BodyParser)    │
                      └──────────────────┬───────────────────┘
                                         ▼
                      ┌──────────────────────────────────────┐
                      │     BaseChyz Controller Dispatcher   │
                      │  (Supports Multiple Route Prefixes)  │
                      └──────────────────┬───────────────────┘
                                         ▼
               ┌────────────────────────────────────────────────────┐
               │              Controller Lifecycle                  │
               │                                                    │
               │  1. beforeAction(route, req, res)                  │
               │     ├── Authenticator Filter (JWT / Keycloak)      │
               │     ├── AccessControl Filter (RBAC Rules)          │
               │     └── Custom ActionFilter Behaviors              │
               │                                                    │
               │  2. Action Handler Execution (@get, @post, ...)    │
               │     ├── ModelManager & Active Record Models        │
               │     ├── Data Loading (model.load(req.body))        │
               │     ├── Database Transactions                      │
               │     └── Business Logic Execution                   │
               │                                                    │
               │  3. afterAction(route, req, res)                   │
               └──────────────────┬─────────────────────────────────┘
                                  ▼
                      ┌──────────────────────────────────────┐
                      │       Standardized JSON / XML        │
                      │      or Unified Error Responses      │
                      └──────────────────────────────────────┘
```

---

## 📦 Installation

Install Chyz and its required peer dependencies:

```bash
npm install chyz reflect-metadata sequelize pg pg-hstore jsonwebtoken
# or using yarn:
yarn add chyz reflect-metadata sequelize pg pg-hstore jsonwebtoken
```

> **Note**: For MySQL, MariaDB, or SQLite, replace `pg pg-hstore` with `mysql2`, `mariadb`, or `sqlite3`.

---

## ⚙️ TypeScript Configuration

Because Chyz utilizes TypeScript decorators and metadata reflection, ensure `experimentalDecorators` and `emitDecoratorMetadata` are enabled in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*", "Controllers/**/*", "Models/**/*"]
}
```

---

## 📁 Recommended Directory Structure

```
my-chyz-service/
├── Controllers/
│   ├── ApiController.ts
│   └── UserController.ts
├── Models/
│   ├── index.ts
│   ├── User.ts
│   ├── Product.ts
│   └── Order.ts
├── config/
│   └── log4js.json
├── .env
├── index.ts
├── package.json
└── tsconfig.json
```

> **Important**: Model filenames should match `<Name>.ts` and export a class named `<Name>Class` (or inherit from `Model`). `ModelManager` automatically scans `Controllers/../Models` and attaches them as `ModelManager.<Name>`.

---

## ⚡ Quick Start

Create your main entry point (`index.ts`):

```typescript
import 'reflect-metadata';
import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

import Chyz, { BaseChyz, DbConnection, WebUser, Logs } from 'chyz';
import { AuthManager } from 'chyz/rbac/AuthManager';
import { User } from './Models/User';

const config = {
  port: process.env.PORT || 3001,
  controllerpath: __dirname + '/Controllers',
  staticFilePath: __dirname + '/public',
  components: {
    // Database connection component
    db: {
      class: DbConnection,
      database: process.env.DB_NAME || 'my_database',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      options: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || '5432'),
        dialect: 'postgres', // 'mysql' | 'mariadb' | 'postgres' | 'mssql'
        logging: (msg: string) => BaseChyz.debug('[SQL]', msg)
      }
    },
    // RBAC Authorization Manager
    authManager: {
      class: AuthManager
    },
    // User Identity Component
    user: {
      class: WebUser,
      identityClass: User
    }
  }
};

// Bootstrap application and listen
Chyz.app(config).then((server) => server.Start());
```

---

## 📖 Core Concepts & Detailed Guide

### 1. Application Configuration & Bootstrapping

`BaseChyz.app(config)` initializes all configured components in sequence:
1. `db` component is initialized first to establish database availability.
2. Other application components (`user`, `authManager`, custom components) are instantiated and their `init()` hooks are executed.
3. Express middlewares (JSON body parser, URL-encoded parser, Method-Override, CORS, Compression) are loaded.
4. Auto-discovery loads all models in the `Models` directory and registers them into `ModelManager`.
5. Controllers from `controllerpath` are imported, inspected for metadata decorators, and registered with Express.

You can access any registered component globally across your application via:
```typescript
const db = BaseChyz.getComponent('db');
const userComponent = BaseChyz.getComponent('user');
const authManager = BaseChyz.getComponent('authManager');
```

---

### 2. Decorator-Driven Controllers

Controllers extend `CWebController` and define route endpoints using method decorators:

```typescript
import {
  CWebController,
  controller,
  get,
  post,
  put,
  delete as del,
  Request,
  Response
} from 'chyz';

@controller('/api/v1/products')
export class ProductController extends CWebController {

  @get('/')
  public async list(req: Request, res: Response) {
    return res.json({ success: true, data: [] });
  }

  @get('/:id')
  public async view(req: Request, res: Response) {
    const { id } = req.params;
    return res.json({ id });
  }

  @post('/')
  public async create(req: Request, res: Response) {
    return res.status(201).json({ created: req.body });
  }

  @put('/:id')
  public async update(req: Request, res: Response) {
    return res.json({ updated: req.params.id, data: req.body });
  }

  @del('/:id')
  public async remove(req: Request, res: Response) {
    return res.json({ deleted: req.params.id });
  }
}

export default ProductController;
```

---

### 3. Multiple Controller Prefixes (Multi-Versioning)

Chyz supports **multiple `@controller` decorators** on the same class. This allows you to serve endpoints across different API versions or paths without code duplication:

```typescript
import { CWebController, controller, get, Request, Response } from 'chyz';

@controller('/api/subaccount')
@controller('/api/v4/subaccount')
export class SubAccountController extends CWebController {

  @get('/profile')
  public getProfile(req: Request, res: Response) {
    // Accessible via:
    // GET /api/subaccount/profile
    // GET /api/v4/subaccount/profile
    return res.json({ message: 'Subaccount profile' });
  }
}
```

---

### 4. Behaviors & Action Filters

Just like Yii2's `behaviors()`, any controller can declare cross-cutting filters such as authentication and RBAC access rules:

```typescript
import {
  CWebController,
  controller,
  get,
  post,
  Request,
  Response,
  JwtHttpBearerAuth,
  AccessControl
} from 'chyz';

@controller('/api/orders')
export class OrderController extends CWebController {

  public behaviors(): any[] {
    return [
      {
        // Authentication filter
        authenticator: {
          class: JwtHttpBearerAuth,
          except: ['public-feed'] // Exclude specific actions
        },
        // Role & Permission access control
        access: {
          class: AccessControl,
          rules: [
            {
              allow: true,
              actions: ['public-feed'],
              roles: ['?'] // '?' matches guests
            },
            {
              allow: true,
              actions: ['create', 'list'],
              roles: ['@'] // '@' matches authenticated users
            },
            {
              allow: true,
              actions: ['delete'],
              roles: ['admin'] // requires 'admin' RBAC role
            }
          ]
        }
      }
    ];
  }

  @get('public-feed')
  public publicFeed(req: Request, res: Response) {
    return res.json({ feed: [] });
  }

  @post('create')
  public create(req: Request, res: Response) {
    return res.json({ status: 'created' });
  }
}
```

---

### 5. Active Record Models & ModelManager

Chyz models inherit from `Model` and configure Sequelize attributes and relational associations:

```typescript
// Models/Product.ts
import { Model, DataTypes, Relation } from 'chyz/base/Model';
import { ModelManager } from 'chyz';

export class ProductClass extends Model {

  public tableName(): string {
    return 'products';
  }

  public attributes() {
    return {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 255]
        }
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    };
  }

  public relations(): Relation[] {
    return [
      {
        type: 'belongsTo',
        model: ModelManager.Category.model(),
        foreignKey: 'category_id',
        as: 'category'
      }
    ];
  }
}
```

#### Querying Models via `ModelManager`
Models placed inside the `Models` directory are automatically discovered and registered:

```typescript
import { ModelManager } from 'chyz';

// Find all products
const products = await ModelManager.Product.findAll({
  include: [{ model: ModelManager.Category.model(), as: 'category' }]
});

// Find one by primary key or criteria
const product = await ModelManager.Product.findOne({
  where: { id: 10 }
});
```

---

### 6. Model Validation & Safe Attribute Loading

Chyz implements Yii2-style safe loading using `load(data, formName)`:

```typescript
import { ModelManager, ValidationHttpException } from 'chyz';

// If req.body is { Product: { title: "Laptop", price: 1200 } }
const product = ModelManager.Product;

if (product.load(req.body, 'Product')) {
  const result = await product.save();
  if (!result) {
    // Model errors are automatically gathered
    throw new ValidationHttpException(product.errors);
  }
}
```

---

### 7. Database Transactions

Transactions are simple to manage via `BaseChyz.getComponent("db").transaction()`:

```typescript
import { BaseChyz, ModelManager, ValidationHttpException } from 'chyz';

let transaction: any;
try {
  const db = BaseChyz.getComponent('db');
  transaction = await db.transaction();

  const customer = ModelManager.Customer;
  customer.load(req.body, 'Customer');
  const cus = await customer.save({}, { transaction });
  if (!cus) {
    throw new ValidationHttpException(customer.errors);
  }

  const order = ModelManager.Order;
  order.load(req.body, 'Order');
  order.setAttribute({ customer_id: cus.id });
  const ord = await order.save({}, { transaction });
  if (!ord) {
    throw new ValidationHttpException(order.errors);
  }

  await transaction.commit();
} catch (error) {
  if (transaction) {
    await transaction.rollback();
  }
  throw error;
}
```

---

### 8. Identity Management & Authentication

Define your User model by implementing `IdentityInterface`:

```typescript
// Models/User.ts
import { Model, DataTypes } from 'chyz/base/Model';
import { IdentityInterface } from 'chyz/web/IdentityInterface';
import { BaseChyz } from 'chyz';
import jwt from 'jsonwebtoken';

export class UserClass extends Model implements IdentityInterface {

  public tableName(): string {
    return 'users';
  }

  public attributes() {
    return {
      username: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      authkey:  { type: DataTypes.STRING, allowNull: true },
      status:   { type: DataTypes.STRING, defaultValue: 'active' }
    };
  }

  public async findIdentityByAccessToken(token: string, type: string) {
    const decoded: any = jwt.decode(token, { complete: true });
    if (!decoded?.payload?.user) {
      return null;
    }

    const identity = await this.findOne({ where: { id: decoded.payload.user } });
    if (identity) {
      try {
        jwt.verify(token, identity.authkey);
        this.setIdentity(identity);
        return this;
      } catch (err) {
        BaseChyz.debug('Token verification failed:', err);
        return null;
      }
    }
    return null;
  }

  public getId(): number {
    return this.model().id;
  }

  public getAuthKey(): string {
    return this.model().authkey;
  }

  public validateAuthKey(authKey: string): boolean {
    return this.getAuthKey() === authKey;
  }
}
```

---

### 9. Role-Based Access Control (RBAC)

Chyz features a full-featured hierarchical RBAC system based on Yii2's auth schema (`auth_item`, `auth_item_child`, `auth_assignment`):

- **AuthItem**: Defines roles (type: `1`) and permissions (type: `2`).
- **AuthItemChild**: Establishes parent-child relationships (e.g., `admin` inherits from `editor`, which has `postCreate`).
- **AuthAssignment**: Assigns users to roles.

#### RBAC Verification in Code:
```typescript
const authManager = BaseChyz.getComponent('authManager');

// Check if user has permission
const hasPermission = await authManager.checkAccess(userId, 'order/delete');

// Retrieve all roles for a user
const roles = await authManager.getRolesByUser(userId);

// Retrieve all permissions for a user
const permissions = await authManager.getPermissionsByUser(userId);
```

---

### 10. Keycloak SSO / OIDC Integration

Chyz provides native Keycloak integration for centralized enterprise SSO:

```typescript
import Keycloak from 'keycloak-connect';
import session from 'express-session';
import Chyz, { WebUser, KeyCloakHttpBearerAuth } from 'chyz';

const keycloak = new Keycloak({ scope: 'offline_access' }, {
  realm: 'EnterpriseRealm',
  'auth-server-url': 'https://sso.example.com/auth/',
  resource: 'my-microservice',
  bearerOnly: true
});

const config = {
  port: 3000,
  controllerpath: __dirname + '/Controllers',
  components: {
    user: {
      class: WebUser,
      identityClass: KeycloakUser
    }
  },
  middlewares: {
    keycloak: {
      keycloak: keycloak,
      config: { logout: '/logout' }
    }
  }
};

Chyz.app(config).then((server) => server.Start());
```

In your controller, use `KeyCloakHttpBearerAuth`:

```typescript
public behaviors(): any[] {
  return [{
    authenticator: {
      class: KeyCloakHttpBearerAuth
    }
  }];
}
```

---

### 11. Lifecycle Events (CEvents)

Hook into any lifecycle event using `BaseChyz.EventEmitter`:

```typescript
import { BaseChyz, CEvents } from 'chyz';

BaseChyz.EventEmitter.on(CEvents.ON_INIT_BEFORE, (app, config) => {
  BaseChyz.info('Bootstrapping initialized...');
});

BaseChyz.EventEmitter.on(CEvents.ON_BEFORE_ACTION, (controller, req, res) => {
  BaseChyz.debug(`Action invoked: ${controller.id}/${req.path}`);
});

BaseChyz.EventEmitter.on(CEvents.ON_START, () => {
  BaseChyz.info('Server successfully listening.');
});
```

Available `CEvents`:
- `ON_INIT_BEFORE`: Triggered before configuration initialization.
- `ON_INIT_AFTER`: Triggered after components and controllers are loaded.
- `ON_MIDDLEWARE`: Triggered when Express middleware chain is bound.
- `ON_BEFORE_START`: Triggered right before `listen()` starts.
- `ON_START`: Triggered when HTTP/HTTPS server is up and listening.
- `ON_BEFORE_ACTION`: Triggered before controller action execution.
- `ON_AFTER_ACTION`: Triggered after controller action execution.
- `ON_DB_CONNECTION`: Triggered on successful DB connection.
- `ON_DB_DISCONNECT`: Triggered on DB disconnect.

---

### 12. Enterprise Logging (log4js)

Chyz comes equipped with structured logging via `log4js`:

```typescript
import { BaseChyz, Logs } from 'chyz';

// Configure custom log4js configuration
const customLogs = new Logs('MyService', require('./config/log4js.json'));

const config = {
  logs: customLogs,
  // ...
};

// Logging methods
BaseChyz.debug('Debug payload', { userId: 42 });
BaseChyz.info('Service processed request');
BaseChyz.warn('Cache miss encountered');
BaseChyz.error('Unhandled exception', error);
BaseChyz.fatal('Critical system shutdown');
```

---

### 13. Exception Handling Hierarchy

Throw semantic HTTP exceptions in your services or controllers. Chyz automatically formats them into consistent JSON responses:

```typescript
import {
  BadRequestHttpException,
  UnauthorizedHttpException,
  ForbiddenHttpException,
  NotFoundHttpException,
  ValidationHttpException
} from 'chyz';

// 400 Bad Request
throw new BadRequestHttpException('Invalid request parameters');

// 401 Unauthorized
throw new UnauthorizedHttpException('Session expired');

// 403 Forbidden
throw new ForbiddenHttpException('Insufficient permissions');

// 404 Not Found
throw new NotFoundHttpException('Customer not found');

// 422 / Validation Error
throw new ValidationHttpException({ email: ['Email format is invalid'] });
```

---

## 📚 API Reference

### Decorators

| Decorator | Target | Description |
| :--- | :--- | :--- |
| `@controller(prefix: string)` | Class | Registers controller base path. Supports stacking multiple decorators for multiple prefixes. |
| `@get(path: string)` | Method | Binds HTTP `GET` route to the controller method. |
| `@post(path: string)` | Method | Binds HTTP `POST` route to the controller method. |
| `@put(path: string)` | Method | Binds HTTP `PUT` route to the controller method. |
| `@delete(path: string)` | Method | Binds HTTP `DELETE` route to the controller method. |
| `@Middleware(handlers[])` | Method | Attaches Express `RequestHandler` middleware directly to the route. |

### Core Classes

| Class | Purpose |
| :--- | :--- |
| `BaseChyz` | Main application instance, component registry, logging facade, and lifecycle manager. |
| `CWebController` | Base class for web controllers offering `beforeAction`, `afterAction`, and `behaviors()`. |
| `Model` | Active Record abstraction wrapping Sequelize models, relations, transactions, and data loading. |
| `ModelManager` | Global registry containing auto-discovered Active Record models. |
| `Component` | Base object for lifecycle-managed components (`init()` hook). |
| `DbConnection` | Sequelize database manager component supporting connection pooling and transactions. |
| `WebUser` | Identity context representing the currently authenticated user in request scope. |
| `AuthManager` | RBAC service providing role/permission hierarchy evaluation. |
| `AccessControl` | Action filter behavior enforcing RBAC and role match rules per route. |
| `JwtHttpBearerAuth` | Bearer token authentication filter decoding and validating JWT tokens. |

---

## 🛠️ Development & Scripts

To run or build the framework locally:

```bash
# Debug / run with ts-node
yarn debug

# Build TypeScript to dist/ with assets and package configs
yarn build

# Run build on Windows environment
yarn build-win
```

---

## 📄 License & Authors

- **Author**: [Cihan Öztürk](https://github.com/cihan53) (<cihan@chy.com.tr>)
- **Organization**: Chy Bilgisayar Bilişim
- **License**: [MIT](https://opensource.org/licenses/MIT)
