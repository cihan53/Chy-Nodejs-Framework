"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationHttpException = void 0;
const BaseError_1 = require("./BaseError");
class ValidationHttpException extends BaseError_1.BaseError {
    constructor(message) {
        super(message, 403);
        this.message = message;
    }
}
exports.ValidationHttpException = ValidationHttpException;
//# sourceMappingURL=ValidationHttpException.js.map