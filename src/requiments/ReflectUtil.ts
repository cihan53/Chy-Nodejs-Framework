/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

/**
 * @param strClass:
 *          class name
 * @param optionals:
 *          constructor arguments
 */
// @ts-ignore
Reflect.newInstance = function (strClass: string) {
    const args = Array.prototype.slice.call(arguments, 1);
    const clsClass = eval(strClass);

    const F = () => {
        return clsClass.apply(this, args);
    }

    F.prototype = clsClass.prototype;
    // @ts-ignore
    return new F();
};