/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {BaseChyz} from "../index";
import {Configurable} from "./Configurable";


export class CBaseObject implements Configurable {

    public init() {
        BaseChyz.debug("BaseObject init.....")
    }
}
