/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import BaseChyz from "../BaseChyz";
import Utils from "../requiments/Utils";
import {Component} from "./Component";
import {InvalidConfigException} from "./InvalidConfigException";
import {DatabaseError, DataTypes, ExclusionConstraintError, ForeignKeyConstraintError, Model as SModel, TimeoutError, UniqueConstraintError, ValidationError,} from "sequelize";
import {Exception} from "./db/Exception";

export {DataTypes, NOW} from "sequelize";

export interface Relation{
    type:  "hasOne"  | "hasMany" | "belongsToMany" | "belongsTo",
    allowNull?:boolean,
    sourceKey:string,
    model:SModel,
    foreignKey:string,
    name?:string,
    through?:any,
    as?:string
}

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

export class Model extends Component {
    _sequelize: any ;
    private _tableName: string;
    private _model: any;
    private _attributes: any = {};
    private _errors: any = {}


    constructor(sequelize?: IDBDatabase) {
        super();
        this._tableName = this.constructor.name;
        // this._sequelize = BaseChyz.getComponent("db").db;
        if (sequelize != null)
            this._sequelize = sequelize;
        else
            this._sequelize = BaseChyz.getComponent("db").db;

        if (!Utils.isEmpty(this.attributes())) {
            this._model = this._sequelize.define(this.constructor.name, this.attributes(), {
                tableName: this.tableName(),
                timestamps: false,
                createdAt: false,
                updateAt:false
            });

        } else {
            throw new InvalidConfigException(BaseChyz.t("Invalid model configuration, is not emty attributes"))
        }

        // this.init();

    }


    /**
     * Returns the database connection used by this AR class.
     * By default, the "db" application component is used as the database connection.
     * You may override this method if you want to use a different database connection.
     * @return Connection the database connection used by this AR class.
     */
    public static getDb()
    {
        return BaseChyz.getComponent("db").db
    }

    get sequelize(): any {
        return this._sequelize;
    }

    set sequelize(value: any) {
        this._sequelize = value;
    }


    /**
     *
     */
    get errors(): any {
        return this._errors;
    }

    set errors(value: any) {
        this._errors = value;
    }

    public init() {
        BaseChyz.debug("Model init....", this.constructor.name)
        /**
         * init buraya
         */
        BaseChyz.debug("Relation init....", this.constructor.name)
        for (const relation of this.relations()) {
            let m = relation.model;

            if(relation.type=="hasOne"  ){
                // @ts-ignore
                delete relation.model
                this.model().hasOne(m, relation );
            }
        //
            if(relation.type=="hasMany" ){
                // @ts-ignore
                delete relation.model;
                this.model().hasMany(m, relation );
            }

            if(relation.type=="belongsTo"  ){
                // @ts-ignore
                delete relation.model;
                this.model().belongsTo(m, relation );
            }

            if(relation.type=="belongsToMany"  ){
                // @ts-ignore
                delete relation.model;
                this.model().belongsToMany(m, relation );
            }
        }

    }


    public tableName() {
        return this._tableName;
    }

    public formName() {
        return this.constructor.name;
    }

    public rules() {
        return []
    }

    public model() {
        return this._model;
    }

    public async save(params = {}, options = {}) {
        // now instantiate an object
        let p = Object.assign(params, this._attributes)
        let result: any;
        try {
            result = await this.model().create(p, options)
        } catch (e) {
            BaseChyz.debug(`Model[${this.constructor.name}].create`, e)
            if (e instanceof ValidationError) {
                let validationErrorItems = e.errors;
                validationErrorItems.forEach(({message, path}) => {
                    // @ts-ignore
                    this._errors[path] = message
                })

                return false;
            } else if (e instanceof DatabaseError) {

            } else if (e instanceof TimeoutError) {

            } else if (e instanceof UniqueConstraintError) {

            } else if (e instanceof ForeignKeyConstraintError) {

            } else if (e instanceof ExclusionConstraintError) {

            }
            throw new Exception(e.message, this.errors, e.code);
        }

        return result;

    }

    public async bulkCreate(params = {}, options = {}) {
        // now instantiate an object
        let p = Object.assign(params, this._attributes)
        let result: any;
        try {
            result = await this.model().bulkCreate(p, options)
        } catch (e) {
            BaseChyz.debug(`Model[${this.constructor.name}].bulkCreate`, e)
            if (e instanceof ValidationError) {
                let validationErrorItems = e.errors;
                validationErrorItems.forEach(({message, path}) => {
                    // @ts-ignore
                    this._errors[path] = message
                })

                return false;
            } else if (e instanceof DatabaseError) {

            } else if (e instanceof TimeoutError) {

            } else if (e instanceof UniqueConstraintError) {

            } else if (e instanceof ForeignKeyConstraintError) {

            } else if (e instanceof ExclusionConstraintError) {

            }
            throw new Exception(e.message, this.errors, e.code);
        }

        return result;

    }

    public update(params = {}, options = {}) {
        let p = Object.assign(params, this._attributes)
        return this.model().update(p, options)
    }

    public delete(params = {}, options = {}) {
        let p = Object.assign(params, this._attributes)
        return this.model().delete(p, options)
    }

    /**
     *
     * @param args
     */
    public findOne(...args: any[]) {
        return this._model.findOne(...arguments)
    }

    /**
     *
     * @param args
     */
    public findAll(...args: any[]) {
        return this._model.findAll(...arguments)
    }


    public validate() {

    }

    /**
     *
     * @param data
     * @param formName
     */
    public load(data: any, formName: any = null) {
        let scope = formName === null ? this.formName() : formName;
        if (scope === '' && !Utils.isEmpty(data)) {
            this.setAttribute(data);
            return true;
        } else if (data[scope]) {
            this.setAttribute(data[scope]);
            return true;
        }
        return false;
    }

    public bulkLoad(data: any, formName: any = null) {
        let scope = formName === null ? this.formName() : formName;
        if (scope === '' && !Utils.isEmpty(data)) {
            this.setAttribute(data);
            return true;
        } else if (data[scope]) {
            this.setAttribute(data[scope]);
            return true;
        }
        return false;
    }

    public setAttribute(values: any, safeOnly = true) {
        if (values instanceof Object) {
            let attributes = this.attributes();
            for (const valueKey in values) {
                if (Object.keys(attributes).indexOf(valueKey) != -1) {
                    // @ts-ignore
                    BaseChyz.debug("Model[" + this.formName() + "] attributes value set ", valueKey, values[valueKey])
                    this._attributes[valueKey] = values[valueKey];
                }
            }
        }
    }

    public attributes() {
        return {}
    }

    /**
     * relation return array
     * [
     *
     * ]
     */
    public relations():Relation[]{
        return []
    }
}