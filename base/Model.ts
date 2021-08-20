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
import {DataTypes} from "sequelize";
import { BaseError } from "./BaseError";

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
    private sequelize: any
    private _tableName: string;
    private _model: any;
    private _attributes: any = {};

    constructor() {
        super();
        this._tableName = this.constructor.name;
        this.sequelize = BaseChyz.getComponent("db").db;

        if (!Utils.isEmpty(this.attributes())) {

            this._model = this.sequelize.define(this.constructor.name, this.attributes(), {
                tableName: this.tableName(),
                timestamps: false
            });

        } else {
            throw new InvalidConfigException(BaseChyz.t("Invalid model configuration, is not emty attributes"))
        }

    }

    public init() {
        BaseChyz.debug("Model init....")
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

    public save() {
        // now instantiate an object
        return this._model.build(this._attributes).save()
    }

    public update() {
        return this._model.build(this._attributes).update()
    }

    public findOne(...args: any[]){
        return this._model.findOne(...arguments)
    }

    public delete() {

    }


    public validate() {

    }

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
}