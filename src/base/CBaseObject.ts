/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {Configurable} from "./Configurable";
import {Logger} from "./Logger";

export class CBaseObject implements Configurable {

    public init() {
        Logger.debug("BaseObject init.....")
    }
}