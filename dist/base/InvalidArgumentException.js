"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidArgumentException = void 0;
const BaseError_1 = require("./BaseError");
class InvalidArgumentException extends BaseError_1.BaseError {
    constructor(message) {
        super(message, 500);
        this.message = message;
    }
}
exports.InvalidArgumentException = InvalidArgumentException;
//# sourceMappingURL=InvalidArgumentException.js.map