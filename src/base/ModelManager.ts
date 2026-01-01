import {Model} from "./Model"

/*
 *
 * Copyright (c) 2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */
// interface ObjectConstructor {
//     _register(o: Model): void;
// }

export interface IModelManager {
    _register(map: { [key: string]: Model }): void;
    [key: string]: any; // Dinamik erişim için hala gerekli olabilir
}

export const ModelManager: IModelManager = {
    _register(map: { [key: string]: Model }) {
        Object.assign(this, map)
    }
}
