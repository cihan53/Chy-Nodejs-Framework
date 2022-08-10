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
    public post(url: string, args: any[],headers:any={}) {
        return axios.post(url, args,headers)
    }

    public get(url: string, args: any[],headers:any={}) {
        return axios.get(url, args ,headers )
    }

    public Rest(params: any) {
        return axios(params)
    }
}
