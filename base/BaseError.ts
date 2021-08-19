/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

export class BaseError extends Error {
    private statusCode: number;

    constructor(message: string) {
        super(message);
        this.message=message;
        this.name = this.constructor.name // good practice
        this.statusCode = 500 // error code for responding to client
        Error.captureStackTrace(this)
    }

    toString(){
        return `${this.name}[${this.statusCode}] ${this.message}`
    }
    toJSON(){
        return {code: this?.statusCode, name: this.name, message: this.message}
    }
}

