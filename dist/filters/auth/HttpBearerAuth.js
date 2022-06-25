"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpBearerAuth = void 0;
const HttpHeaderAuth_1 = require("./HttpHeaderAuth");
class HttpBearerAuth extends HttpHeaderAuth_1.HttpHeaderAuth {
    constructor() {
        super(...arguments);
        /**
         * {@inheritdoc}
         */
        this.header = 'Authorization';
        // @ts-ignore
        this.pattern = /^Bearer\s+(.*?)$/;
        /**
         * @var string the HTTP authentication realm
         */
        this.realm = 'api';
    }
    /**
     * {@inheritdoc}
     */
    challenge(response) {
        response.set('WWW-Authenticate', `Bearer realm="${this.realm}"`);
    }
}
exports.HttpBearerAuth = HttpBearerAuth;
//# sourceMappingURL=HttpBearerAuth.js.map