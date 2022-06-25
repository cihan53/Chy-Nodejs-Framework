"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseError = void 0;
const Utils_1 = __importDefault(require("../requiments/Utils"));
class BaseError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.message = Utils_1.default.isString(message) ? message : JSON.stringify(message);
        this.name = this.constructor.name; // good practice
        this.statusCode = statusCode; // error code for responding to client
        //Error.captureStackTrace(this)
    }
    toString() {
        return `${this.name}[${this.statusCode}] ${this.message}`;
    }
    toJSON() {
        return { code: this === null || this === void 0 ? void 0 : this.statusCode, name: this.name, message: this.message };
    }
}
exports.BaseError = BaseError;
//# sourceMappingURL=BaseError.js.map