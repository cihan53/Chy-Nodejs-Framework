/*
 *
 * Copyright (c) 2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */


import {Component} from "./Component";

const axios = require('axios')

export class RestClient extends Component {
    public post(url: string, args: any[]) {
        return axios.post(url, args)
    }

    public get(url: string, args: any[]) {
        return axios.post(url, args)
    }

    public Rest(params: any) {
        return axios(params)
    }
}
export default new RestClient();