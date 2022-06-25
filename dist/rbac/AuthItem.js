"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthItemClass = void 0;
const base_1 = require("../base");
class AuthItemClass extends base_1.Model {
    tableName() {
        return 'auth_item';
    }
    attributes() {
        return {
            // Model attributes are defined here
            name: {
                type: base_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            type: {
                type: base_1.DataTypes.INTEGER,
                allowNull: false
            },
            description: {
                type: base_1.DataTypes.STRING,
                allowNull: false
            },
            rule_name: {
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
exports.AuthItemClass = AuthItemClass;
//# sourceMappingURL=AuthItem.js.map