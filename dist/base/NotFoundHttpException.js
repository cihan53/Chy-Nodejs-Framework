"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundHttpException = void 0;
const BaseError_1 = require("./BaseError");
class NotFoundHttpException extends BaseError_1.BaseError {
    constructor(message) {
        super(message, 404);
        this.message = message;
    }
}
exports.NotFoundHttpException = NotFoundHttpException;
//# sourceMappingURL=NotFoundHttpException.js.map