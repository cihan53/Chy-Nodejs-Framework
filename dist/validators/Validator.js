"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const base_1 = require("../base");
class Validator extends base_1.Component {
    constructor() {
        super(...arguments);
        /**
         * @var array|string attributes to be validated by this validator. For multiple attributes,
         * please specify them as an array; for single attribute, you may use either a string or an array.
         */
        this.attributes = [];
        this.message = "";
        this.except = [];
        this.isEmpty = [];
    }
    init() {
        super.init();
    }
    static createValidator(type, model, attributes, params = []) {
    }
}
exports.Validator = Validator;
Validator.builtInValidators = {
    'boolean': '',
    'email': '',
};
//# sourceMappingURL=Validator.js.map