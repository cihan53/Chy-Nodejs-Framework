"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthItemChildClass = void 0;
const base_1 = require("../base");
class AuthItemChildClass extends base_1.Model {
    tableName() {
        return 'auth_item_child';
    }
    attributes() {
        return {
            // Model attributes are defined here
            parent: {
                type: base_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            child: {
                type: base_1.DataTypes.STRING,
                allowNull: false
            }
        };
    }
    init() {
        super.init();
        this.model().removeAttribute('id');
    }
    relations() {
        return [
            {
                type: "hasOne",
                foreignKey: "item_name",
                model: base_1.ModelManager.AuthAssignment.model()
            }
        ];
    }
}
exports.AuthItemChildClass = AuthItemChildClass;
//# sourceMappingURL=AuthItemChild.js.map