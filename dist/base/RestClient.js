"use strict";
/*
 *
 * Copyright (c) 2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestClient = void 0;
const Component_1 = require("./Component");
const axios = require('axios');
class RestClient extends Component_1.Component {
    post(url, args, headers = {}) {
        return axios.post(url, args, headers);
    }
    get(url, args, headers = {}) {
        return axios.get(url, args, headers);
    }
    Rest(params) {
        return axios(params);
    }
}
exports.RestClient = RestClient;
exports.default = new RestClient();
//# sourceMappingURL=RestClient.js.map