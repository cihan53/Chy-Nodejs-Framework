/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {Configurable} from "./Configurable";
import BaseChyz from "../BaseChyz";
import Utils from "../requiments/Utils";

export class BaseObject implements Configurable {


    /**
     * Constructor.
     *
     * The default implementation does two things:
     *
     * - Initializes the object with the given configuration `$config`.
     * - Call [[init()]].
     *
     * If this method is overridden in a child class, it is recommended that
     *
     * - the last parameter of the constructor is a configuration array, like `$config` here.
     * - call the parent implementation at the end of the constructor.
     *
     * @param array $config name-value pairs that will be used to initialize the object properties
     */
    constructor(config = []) {
        if (!Utils.isEmpty(config)) {
            //Yii::configure($this, $config);
            for (const configElement of Object.keys(config)) {
                // @ts-ignore
                this[configElement] = config[configElement];
            }
        }


        this.init();
    }

    public init() {

        BaseChyz.debug("BaseObject init.....",)
        BaseChyz.info("BaseObject params",  Object.getOwnPropertyNames(this) )

    }
}