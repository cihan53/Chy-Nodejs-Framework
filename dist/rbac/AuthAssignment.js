"use strict";
/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAssignmentClass = void 0;
const base_1 = require("../base");
class AuthAssignmentClass extends base_1.Model {
    tableName() {
        return 'auth_assignment';
    }
    attributes() {
        return {
            // Model attributes are defined here
            item_name: {
                type: base_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
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
                type: "hasMany",
                foreignKey: "name",
                sourceKey: 'item_name',
                model: base_1.ModelManager.AuthItem.model()
            }
        ];
    }
}
exports.AuthAssignmentClass = AuthAssignmentClass;
//# sourceMappingURL=AuthAssignment.js.map