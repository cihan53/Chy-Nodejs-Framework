/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {BaseError} from "./BaseError";

export class ValidationHttpException extends BaseError {
    constructor ( public message: any) {
        super(message,400);
    }
}
