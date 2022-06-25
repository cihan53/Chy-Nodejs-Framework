"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = exports.NOW = exports.DataTypes = void 0;
const BaseChyz_1 = __importDefault(require("../BaseChyz"));
const Utils_1 = __importDefault(require("../requiments/Utils"));
const Component_1 = require("./Component");
const InvalidConfigException_1 = require("./InvalidConfigException");
const sequelize_1 = require("sequelize");
const Exception_1 = require("./db/Exception");
var sequelize_2 = require("sequelize");
Object.defineProperty(exports, "DataTypes", { enumerable: true, get: function () { return sequelize_2.DataTypes; } });
Object.defineProperty(exports, "NOW", { enumerable: true, get: function () { return sequelize_2.NOW; } });
/**
 * ValidateMe.init({
  bar: {
    type: Sequelize.STRING,
    validate: {
      is: ["^[a-z]+$",'i'],     // will only allow letters
      is: /^[a-z]+$/i,          // same as the previous example using real RegExp
      not: ["[a-z]",'i'],       // will not allow letters
      isEmail: true,            // checks for email format (foo@bar.com)
      isUrl: true,              // checks for url format (http://foo.com)
      isIP: true,               // checks for IPv4 (129.89.23.1) or IPv6 format
      isIPv4: true,             // checks for IPv4 (129.89.23.1)
      isIPv6: true,             // checks for IPv6 format
      isAlpha: true,            // will only allow letters
      isAlphanumeric: true,     // will only allow alphanumeric characters, so "_abc" will fail
      isNumeric: true,          // will only allow numbers
      isInt: true,              // checks for valid integers
      isFloat: true,            // checks for valid floating point numbers
      isDecimal: true,          // checks for any numbers
      isLowercase: true,        // checks for lowercase
      isUppercase: true,        // checks for uppercase
      notNull: true,            // won't allow null
      isNull: true,             // only allows null
      notEmpty: true,           // don't allow empty strings
      equals: 'specific value', // only allow a specific value
      contains: 'foo',          // force specific substrings
      notIn: [['foo', 'bar']],  // check the value is not one of these
      isIn: [['foo', 'bar']],   // check the value is one of these
      notContains: 'bar',       // don't allow specific substrings
      len: [2,10],              // only allow values with length between 2 and 10
      isUUID: 4,                // only allow uuids
      isDate: true,             // only allow date strings
      isAfter: "2011-11-05",    // only allow date strings after a specific date
      isBefore: "2011-11-05",   // only allow date strings before a specific date
      max: 23,                  // only allow values <= 23
      min: 23,                  // only allow values >= 23
      isCreditCard: true,       // check for valid credit card numbers

      // Examples of custom validators:
      isEven(value) {
        if (parseInt(value) % 2 !== 0) {
          throw new Error('Only even values are allowed!');
        }
      }
      isGreaterThanOtherField(value) {
        if (parseInt(value) <= parseInt(this.otherField)) {
          throw new Error('Bar must be greater than otherField.');
        }
      }
    }
  }
}, { sequelize });
 */
class Model extends Component_1.Component {
    constructor(sequelize) {
        super();
        this._attributes = {};
        this._errors = {};
        this._tableName = this.alias();
        BaseChyz_1.default.debug("Model constructor", this._tableName);
        // this._sequelize = BaseChyz.getComponent("db").db;
        if (sequelize != null)
            this._sequelize = sequelize;
        else
            this._sequelize = this.getDb();
        if (!Utils_1.default.isEmpty(this.attributes())) {
            this._model = this._sequelize.define(this._tableName, this.attributes(), {
                tableName: this.tableName(),
                timestamps: false,
                createdAt: false,
                updateAt: false
            });
        }
        else {
            throw new InvalidConfigException_1.InvalidConfigException(BaseChyz_1.default.t("Invalid model configuration, is not emty attributes"));
        }
        // this.init();
    }
    /**
     * Returns the database connection used by this AR class.
     * By default, the "db" application component is used as the database connection.
     * You may override this method if you want to use a different database connection.
     * @return Connection the database connection used by this AR class.
     */
    getDb() {
        return BaseChyz_1.default.getComponent("db").db;
    }
    getDbConnection() {
        return BaseChyz_1.default.getComponent("db");
    }
    get sequelize() {
        return this._sequelize;
    }
    set sequelize(value) {
        this._sequelize = value;
    }
    provider() {
        return this._sequelize;
    }
    /**
     *
     */
    get errors() {
        return this._errors;
    }
    set errors(value) {
        this._errors = value;
    }
    init() {
        BaseChyz_1.default.debug("Model init....", this.constructor.name);
        /**
         * init buraya
         */
        BaseChyz_1.default.debug("Relation init....", this.constructor.name);
        for (const relation of this.relations()) {
            let m = relation.model;
            if (relation.type == "hasOne") {
                // @ts-ignore
                delete relation.model;
                this.model().hasOne(m, relation);
            }
            //
            if (relation.type == "hasMany") {
                // @ts-ignore
                delete relation.model;
                this.model().hasMany(m, relation);
            }
            if (relation.type == "belongsTo") {
                // @ts-ignore
                delete relation.model;
                this.model().belongsTo(m, relation);
            }
            if (relation.type == "belongsToMany") {
                // @ts-ignore
                delete relation.model;
                this.model().belongsToMany(m, relation);
            }
        }
    }
    alias() {
        return this.constructor.name;
    }
    tableName() {
        return this._tableName;
    }
    formName() {
        return this.constructor.name;
    }
    rules() {
        return [];
    }
    setModel(value) {
        this._model = value;
    }
    model() {
        return this._model;
    }
    save(params = {}, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // now instantiate an object
            let p = Object.assign(params, this._attributes);
            let result;
            try {
                result = yield this.model().create(p, options);
            }
            catch (e) {
                BaseChyz_1.default.debug(`Model[${this.constructor.name}].create`, e);
                if (e instanceof sequelize_1.ValidationError) {
                    let validationErrorItems = e.errors;
                    validationErrorItems.forEach(({ message, path }) => {
                        // @ts-ignore
                        this._errors[path] = message;
                    });
                    return false;
                }
                else if (e instanceof sequelize_1.DatabaseError) {
                }
                else if (e instanceof sequelize_1.TimeoutError) {
                }
                else if (e instanceof sequelize_1.UniqueConstraintError) {
                }
                else if (e instanceof sequelize_1.ForeignKeyConstraintError) {
                }
                else if (e instanceof sequelize_1.ExclusionConstraintError) {
                }
                throw new Exception_1.Exception(e.message, this.errors, e.code);
            }
            return result;
        });
    }
    bulkCreate(params = {}, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // now instantiate an object
            let p = Object.assign(params, this._attributes);
            let result;
            try {
                result = yield this.model().bulkCreate(p, options);
            }
            catch (e) {
                BaseChyz_1.default.debug(`Model[${this.constructor.name}].bulkCreate`, e);
                if (e instanceof sequelize_1.ValidationError) {
                    let validationErrorItems = e.errors;
                    validationErrorItems.forEach(({ message, path }) => {
                        // @ts-ignore
                        this._errors[path] = message;
                    });
                    return false;
                }
                else if (e instanceof sequelize_1.DatabaseError) {
                }
                else if (e instanceof sequelize_1.TimeoutError) {
                }
                else if (e instanceof sequelize_1.UniqueConstraintError) {
                }
                else if (e instanceof sequelize_1.ForeignKeyConstraintError) {
                }
                else if (e instanceof sequelize_1.ExclusionConstraintError) {
                }
                throw new Exception_1.Exception(e.message, this.errors, e.code);
            }
            return result;
        });
    }
    update(params = {}, options = {}) {
        let p = Object.assign(params, this._attributes);
        return this.model().update(p, options);
    }
    delete(params = {}, options = {}) {
        let p = Object.assign(params, this._attributes);
        return this.model().delete(p, options);
    }
    /**
     * As there are often use cases in which it is just easier to execute raw / already prepared SQL queries, you can use the sequelize.query method.
     *
     * By default the function will return two arguments - a results array, and an object containing metadata (such as amount of affected rows, etc). Note that since this is a raw query, the metadata are dialect specific. Some dialects return the metadata "within" the results object (as properties on an array). However, two arguments will always be returned, but for MSSQL and MySQL it will be two references to the same object.
     *
     * const [results, metadata] = await sequelize.query("UPDATE users SET y = 42 WHERE x = 12");
     * // Results will be an empty array and metadata will contain the number of affected rows.
     *
     * In cases where you don't need to access the metadata you can pass in a query type to tell sequelize how to format the results. For example, for a simple select query you could do:
     *
     * const { QueryTypes } = require('@sequelize/core');
     * const users = await sequelize.query("SELECT * FROM `users`", { type: QueryTypes.SELECT });
     * // We didn't need to destructure the result here - the results were returned directly
     *
     * Several other query types are available. Peek into the source for details.
     *
     * A second option is the model. If you pass a model the returned data will be instances of that model.
     *
     * // Callee is the model definition. This allows you to easily map a query to a predefined model
     * const projects = await sequelize.query('SELECT * FROM projects', {
     *   model: Projects,
     *   mapToModel: true // pass true here if you have any mapped fields
     * });
     * // Each element of `projects` is now an instance of Project
     *
     * See more options in the query API reference. Some examples:
     * ``
     * const { QueryTypes } = require('@sequelize/core');
     * await sequelize.query('SELECT 1', {
     *   // A function (or false) for logging your queries
     *   // Will get called for every SQL query that gets sent
     *   // to the server.
     *   logging: console.log,
     *
     *   // If plain is true, then sequelize will only return the first
     *   // record of the result set. In case of false it will return all records.
     *   plain: false,
     *
     *   // Set this to true if you don't have a model definition for your query.
     *   raw: false,
     *
     *   // The type of query you are executing. The query type affects how results are formatted before they are passed back.
     *   type: QueryTypes.SELECT
     * });
     *``
     * // Note the second argument being null!
     * // Even if we declared a callee here, the raw: true would
     * // supersede and return a raw object.
     * console.log(await sequelize.query('SELECT * FROM projects', { raw: true }));
     *
     * ##"Dotted" attributes and the nest option
     *
     * If an attribute name of the table contains dots, the resulting objects can become nested objects by setting the nest: true option. This is achieved with dottie.js under the hood. See below:
     *
     *     Without nest: true:
     * ``
     *     const { QueryTypes } = require('@sequelize/core');
     *     const records = await sequelize.query('select 1 as `foo.bar.baz`', {
     *       type: QueryTypes.SELECT
     *     });
     *     console.log(JSON.stringify(records[0], null, 2));
     *
     *     {
     *       "foo.bar.baz": 1
     *     }
     *
     *     With nest: true:
     *
     *     const { QueryTypes } = require('@sequelize/core');
     *     const records = await sequelize.query('select 1 as `foo.bar.baz`', {
     *       nest: true,
     *       type: QueryTypes.SELECT
     *     });
     *     console.log(JSON.stringify(records[0], null, 2));
     *
     *     {
     *       "foo": {
     *         "bar": {
     *           "baz": 1
     *         }
     *       }
     *     }
     * ``
     * ##Replacements
     *
     * Replacements in a query can be done in two different ways, either using named parameters (starting with :), or unnamed, represented by a ?. Replacements are passed in the options object.
     *
     *     If an array is passed, ? will be replaced in the order that they appear in the array
     *     If an object is passed, :key will be replaced with the keys from that object. If the object contains keys not found in the query or vice versa, an exception will be thrown.
     * ``
     * const { QueryTypes } = require('@sequelize/core');
     *
     * await sequelize.query(
     *   'SELECT * FROM projects WHERE status = ?',
     *   {
     *     replacements: ['active'],
     *     type: QueryTypes.SELECT
     *   }
     * );
     *
     * await sequelize.query(
     *   'SELECT * FROM projects WHERE status = :status',
     *   {
     *     replacements: { status: 'active' },
     *     type: QueryTypes.SELECT
     *   }
     * );
     * ``
     * Array replacements will automatically be handled, the following query searches for projects where the status matches an array of values.
     * ``
     * const { QueryTypes } = require('@sequelize/core');
     *
     * await sequelize.query(
     *   'SELECT * FROM projects WHERE status IN(:status)',
     *   {
     *     replacements: { status: ['active', 'inactive'] },
     *     type: QueryTypes.SELECT
     *   }
     * );
     * ``
     * To use the wildcard operator %, append it to your replacement. The following query matches users with names that start with 'ben'.
     * ``
     * const { QueryTypes } = require('@sequelize/core');
     *
     * await sequelize.query(
     *   'SELECT * FROM users WHERE name LIKE :search_name',
     *   {
     *     replacements: { search_name: 'ben%' },
     *     type: QueryTypes.SELECT
     *   }
     * ); ``
     *
     * ##Bind Parameter
     *
     * Bind parameters are like replacements. Except replacements are escaped and inserted into the query by sequelize before the query is sent to the database, while bind parameters are sent to the database outside the SQL query text. A query can have either bind parameters or replacements. Bind parameters are referred to by either $1, $2, ... (numeric) or $key (alpha-numeric). This is independent of the dialect.
     *
     *     If an array is passed, $1 is bound to the 1st element in the array (bind[0])
     *     If an object is passed, $key is bound to object['key']. Each key must begin with a non-numeric char. $1 is not a valid key, even if object['1'] exists.
     *     In either case $$ can be used to escape a literal $ sign.
     *
     * The array or object must contain all bound values or Sequelize will throw an exception. This applies even to cases in which the database may ignore the bound parameter.
     *
     * The database may add further restrictions to this. Bind parameters cannot be SQL keywords, nor table or column names. They are also ignored in quoted text or data. In PostgreSQL it may also be needed to typecast them, if the type cannot be inferred from the context $1::varchar.
     *``
     * const { QueryTypes } = require('@sequelize/core');
     *
     * await sequelize.query(
     *   'SELECT *, "text with literal $$1 and literal $$status" as t FROM projects WHERE status = $1',
     *   {
     *     bind: ['active'],
     *     type: QueryTypes.SELECT
     *   }
     * ); ``
     *
     * `` await sequelize.query(
     *   'SELECT *, "text with literal $$1 and literal $$status" as t FROM projects WHERE status = $status',
     *   {
     *     bind: { status: 'active' },
     *     type: QueryTypes.SELECT
     *   }
     * );``
     * @param query
     */
    rawQuery(query, options = { type: sequelize_1.QueryTypes.SELECT, nest: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model().query(query, options);
        });
    }
    /**
     *
     * @param args
     */
    findOne(...args) {
        return this._model.findOne(...arguments);
    }
    /**
     *
     * @param args
     */
    findAll(...args) {
        return this._model.findAll(...arguments);
    }
    /**
     * return {count : number , rows: any}
     * @param args
     */
    findAndCountAll(...args) {
        return this._model.findAndCountAll(...arguments);
    }
    validate() {
    }
    /**
     *
     * @param data
     * @param formName
     */
    load(data, formName = null) {
        let scope = formName === null ? this.formName() : formName;
        if (scope === '' && !Utils_1.default.isEmpty(data)) {
            this.setAttribute(data);
            return true;
        }
        else if (data[scope]) {
            this.setAttribute(data[scope]);
            return true;
        }
        return false;
    }
    bulkLoad(data, formName = null) {
        let scope = formName === null ? this.formName() : formName;
        if (scope === '' && !Utils_1.default.isEmpty(data)) {
            this.setAttribute(data);
            return true;
        }
        else if (data[scope]) {
            this.setAttribute(data[scope]);
            return true;
        }
        return false;
    }
    setAttribute(values, safeOnly = true) {
        if (values instanceof Object) {
            let attributes = this.attributes();
            for (const valueKey in values) {
                if (Object.keys(attributes).indexOf(valueKey) != -1) {
                    // @ts-ignore
                    BaseChyz_1.default.debug("Model[" + this.formName() + "] attributes value set ", valueKey, values[valueKey]);
                    this._attributes[valueKey] = values[valueKey];
                }
            }
        }
    }
    attributes() {
        return {};
    }
    /**
     * relation return array
     * [
     *
     * ]
     */
    relations() {
        return [];
    }
}
exports.Model = Model;
//# sourceMappingURL=Model.js.map