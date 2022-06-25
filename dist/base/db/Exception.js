"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = void 0;
const BaseError_1 = require("../BaseError");
class Exception extends BaseError_1.BaseError {
    constructor(message, errorInfo = [], code = '', previous = null) {
        super(message);
        this.errorInfo = [];
        this.errorInfo = errorInfo;
        this.name = 'Database Exception'; // good practice
        this.code = code; // error code for responding to client
        Error.captureStackTrace(this);
    }
}
exports.Exception = Exception;
//# sourceMappingURL=Exception.js.map