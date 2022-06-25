"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenHttpException = void 0;
const BaseError_1 = require("./BaseError");
class ForbiddenHttpException extends BaseError_1.BaseError {
    constructor(message) {
        super(message, 403);
    }
}
exports.ForbiddenHttpException = ForbiddenHttpException;
//# sourceMappingURL=ForbiddenHttpException.js.map