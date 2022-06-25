"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedHttpException = void 0;
const BaseError_1 = require("./BaseError");
class UnauthorizedHttpException extends BaseError_1.BaseError {
    constructor(message) {
        super(message, 401);
        this.message = message;
    }
}
exports.UnauthorizedHttpException = UnauthorizedHttpException;
//# sourceMappingURL=UnauthorizedHttpException.js.map