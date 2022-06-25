"use strict";
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
exports.DbConnection = void 0;
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
// @ts-ignore
const { Sequelize } = require("sequelize");
const Component_1 = require("./Component");
const BaseChyz_1 = __importDefault(require("../BaseChyz"));
const sequelizeCache = require('sequelize-transparent-cache');
class DbConnection extends Component_1.Component {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const sequelize = new Sequelize(this.database, this.username, this.password, this.options);
            this._db = sequelize;
            sequelize
                .authenticate()
                .then(() => {
                BaseChyz_1.default.info('Connection has been established successfully.');
            })
                .catch((err) => {
                BaseChyz_1.default.error('Unable to connect to the database:', err);
            });
            // await this.connect();
        });
    }
    get db() {
        return this._db;
    }
    set db(value) {
        this._db = value;
    }
    transaction() {
        return this.db.transaction();
    }
}
exports.DbConnection = DbConnection;
//# sourceMappingURL=DbConnection.js.map