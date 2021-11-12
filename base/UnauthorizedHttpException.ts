/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {BaseError} from "./BaseError";

export class UnauthorizedHttpException extends BaseError {
    constructor ( public message: string) {
        super(message,401);
    }

}


