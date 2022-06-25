import {Model} from "./Model"

/*
 *
 * Copyright (c) 2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */
interface ObjectConstructor {
    _register(o: Model): void;
}

export const ModelManager: any = {
    _register(map: Model) {
        Object.assign(this, map)
    }
}