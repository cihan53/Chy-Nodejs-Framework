"use strict";
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
Reflect.newInstance = function (strClass) {
    var args = Array.prototype.slice.call(arguments, 1);
    var clsClass = eval(strClass);
    const F = () => {
        return clsClass.apply(this, args);
    };
    F.prototype = clsClass.prototype;
    // @ts-ignore
    return new F();
};
//# sourceMappingURL=ReflectUtil.js.map