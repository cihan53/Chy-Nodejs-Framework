/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
import Chyz, {BaseChyz, DbConnection, Logs, WebUser} from "../src/";
import {FastifyServer} from "../src/provider/FastifyServer";
import {BaseChyzConfig} from "../src/BaseChyz";

let config: BaseChyzConfig = {
    controllerPath: __dirname + "/Controllers",
    provider: {
        class: FastifyServer,
        config: {
            port: 3000
        }
    },

}

Chyz.app(config).Start()
