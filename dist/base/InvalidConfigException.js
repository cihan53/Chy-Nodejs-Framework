"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidConfigException = void 0;
const BaseError_1 = require("./BaseError");
class InvalidConfigException extends BaseError_1.BaseError {
    constructor(message) {
        super(message, 500);
        this.message = message;
    }
}
exports.InvalidConfigException = InvalidConfigException;
//# sourceMappingURL=InvalidConfigException.js.map