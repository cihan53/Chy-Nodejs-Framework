/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {BaseError} from "./BaseError";

export class NotFoundHttpException extends BaseError {
    constructor ( public message: any) {
        super(message,404);
    }
}
