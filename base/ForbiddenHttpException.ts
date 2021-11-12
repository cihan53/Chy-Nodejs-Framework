/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {BaseError} from "./BaseError";
export class ForbiddenHttpException extends BaseError {
    constructor ( message: string) {
        super(message,403);
    }
}


