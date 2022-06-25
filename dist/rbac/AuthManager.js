"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthManager = void 0;
const base_1 = require("../base");
const index_1 = require("../index");
const Utils_1 = __importDefault(require("../requiments/Utils"));
class AuthManager extends base_1.Component {
    constructor() {
        super(...arguments);
        this.checkAccessAssignments = {};
        this.defaultRoles = {};
    }
    init() {
        index_1.BaseChyz.info("Auth Manager init....");
    }
    /**
     *
     */
    checkAccess(userId, permissionName, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            let assignments;
            if (!this.checkAccessAssignments[userId.toString()]) {
                assignments = yield this.getAssignments(userId);
                this.checkAccessAssignments[userId.toString()] = assignments;
            }
            else {
                assignments = this.checkAccessAssignments[userId.toString()];
            }
            // BaseChyz.info("assignments",assignments)
            if (this.hasNoAssignments(assignments)) {
                return false;
            }
            return yield this.checkAccessRecursive(userId, permissionName, params, assignments);
        });
    }
    checkAccessFromCache() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    checkAccessRecursive(user, itemname, params, assignments) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = yield this.getItem(itemname);
            if (!item)
                return false;
            /**
             * @todo
             * Rule test edilmeli
             */
            if (assignments[itemname] || Utils_1.default.find(this.defaultRoles, itemname)) {
                return true;
            }
            /**
             * item child
             */
            let parents = yield base_1.ModelManager.AuthItemChild.findAll({ attributes: ["parent"], where: { child: itemname } });
            for (const parent of parents) {
                let r = yield this.checkAccessRecursive(user, parent.parent, params, assignments);
                if (r) {
                    return true;
                }
            }
            return false;
        });
    }
    /**
     *
     * @param name
     */
    getItem(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name)
                return null;
            return yield base_1.ModelManager.AuthItem.findOne({ where: { name: name } });
        });
    }
    getItems(type) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = {};
            let _items = yield base_1.ModelManager.AuthItem.findAll({ where: { type: type } });
            if (_items)
                _items.forEach((item) => {
                    items[item["name"]] = item.dataValues;
                });
            return items;
        });
    }
    getRolesByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isEmptyUserId(userId.toString())) {
                return [];
            }
            let roles = {};
            let items = yield base_1.ModelManager.AuthAssignment.findAll({
                where: {
                    user_id: userId.toString(),
                    '$AuthItemClasses.type$': AuthManager.TYPE_ROLE
                },
                include: [{
                        model: base_1.ModelManager.AuthItem.model()
                    }]
            });
            for (const item of items) {
                for (const i of item.AuthItemClasses)
                    roles[i["name"]] = i.dataValues;
            }
            return roles;
        });
    }
    /**
     *
     * @param roleName
     */
    getChildRoles(roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield this.getRole(roleName);
            if (role === null) {
                throw new index_1.InvalidArgumentException(`Role "${roleName}" not found.`);
            }
            const result = { result: {} };
            yield this.getChildrenRecursive(roleName, yield this.getChildrenList(), result);
            let roles = {};
            roles[roleName] = role;
            let _roles = yield this.getRoles();
            let _r = {};
            Utils_1.default.forEach(_roles, (item) => {
                if (result.result[item.name])
                    _r[item.name] = item;
            });
            return Utils_1.default.merge(roles, _r);
        });
    }
    /**
     *
     * @param roleName
     */
    getPermissionsByRole(roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            let childrenList = this.getChildrenList();
            const result = { result: {} };
            let permissions = {};
            yield this.getChildrenRecursive(roleName, childrenList, result);
            if (Utils_1.default.isEmpty(result.result)) {
                return {};
            }
            let itemResult = yield base_1.ModelManager.AuthItem.findAll({
                where: {
                    type: AuthManager.TYPE_PERMISSION,
                    name: Object.keys(result.result)
                }
            });
            for (const itemElement of itemResult) {
                permissions[itemElement["name"]] = itemElement.dataValues;
            }
            return permissions;
        });
    }
    /**
     *
     * @param userId
     */
    getPermissionsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isEmptyUserId(userId.toString())) {
                return {};
            }
            let directPermission = yield this.getDirectPermissionsByUser(userId);
            let inheritedPermission = yield this.getInheritedPermissionsByUser(userId);
            return Utils_1.default.merge(directPermission, inheritedPermission);
        });
    }
    /**
     * Returns all permissions that are directly assigned to user.
     * @return Permission[] all direct permissions that the user has. The array is indexed by the permission names.
     */
    getDirectPermissionsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let permissions = {};
            let result = yield base_1.ModelManager.AuthAssignment.findAll({
                where: {
                    user_id: userId.toString(),
                    '$AuthItemClasses.type$': AuthManager.TYPE_PERMISSION
                },
                include: [
                    {
                        model: base_1.ModelManager.AuthItem.model()
                    }
                ]
            });
            for (const resultElement of result) {
                for (const i of resultElement.AuthItemClasses)
                    permissions[i["name"]] = i.dataValues;
            }
            return permissions;
        });
    }
    getInheritedPermissionsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let userAssignment = yield base_1.ModelManager.AuthAssignment.findAll({ where: { user_id: userId.toString() }, attributes: ["item_name"] });
            let childrenList = yield this.getChildrenList();
            const result = { result: {} };
            let permissions = {};
            for (const userAssignmentElement of userAssignment) {
                this.getChildrenRecursive(userAssignmentElement.item_name, childrenList, result);
            }
            if (Utils_1.default.isEmpty(result.result)) {
                return {};
            }
            let itemResult = yield base_1.ModelManager.AuthItem.findAll({
                where: {
                    type: AuthManager.TYPE_PERMISSION,
                    name: Object.keys(result.result)
                }
            });
            for (const itemElement of itemResult) {
                permissions[itemElement["name"]] = itemElement.dataValues;
            }
            return permissions;
        });
    }
    /**
     *
     * @param userId
     */
    getItemsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield base_1.ModelManager.AuthAssignment.findAll({
                where: {
                    user_id: userId.toString()
                },
                include: [{
                        model: base_1.ModelManager.AuthItem.model()
                    }]
            });
            return items;
        });
    }
    /**
     * Returns all role assignment information for the specified role.
     * @param $roleName
     */
    getUserIdsByRole(roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!roleName)
                return [];
            return yield base_1.ModelManager.AuthAssignment.findAll({ where: { "item_name": roleName }, attributes: ["user_id"] });
        });
    }
    /**
     * {@inheritdoc}
     */
    getRole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = yield this.getItem(name);
            return item && item.type == AuthManager.TYPE_ROLE ? item : null;
        });
    }
    /**
     * {@inheritdoc}
     */
    getRoles() {
        return this.getItems(AuthManager.TYPE_ROLE);
    }
    /**
     * Recursively finds all children and grand children of the specified item.
     * @param string $name the name of the item whose children are to be looked for.
     * @param array $childrenList the child list built via [[getChildrenList()]]
     * @param array $result the children and grand children (in array keys)
     */
    getChildrenRecursive(name, childrenList, model) {
        if (childrenList[name]) {
            for (const child of childrenList[name]) {
                model.result[child] = true;
                this.getChildrenRecursive(child, childrenList, model);
            }
        }
    }
    /**
     *
     * @param roleName
     * @param userId
     */
    getAssignment(roleName, userId) {
        if (this.isEmptyUserId(userId)) {
            return [];
        }
        return base_1.ModelManager.AuthAssignment.findAll({ where: { user_id: userId, items_name: roleName } });
    }
    /**
     *
     */
    getAssignments(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isEmptyUserId(userId.toString())) {
                return {};
            }
            let assignments = {};
            try {
                let as = yield base_1.ModelManager.AuthAssignment.findAll({ where: { user_id: userId.toString() } });
                for (const a of as) {
                    assignments[a["item_name"]] = a;
                }
            }
            catch (e) {
                throw new base_1.InvalidConfigException('The user application component must be available to specify roles in AccessRule.');
            }
            return assignments;
        });
    }
    /**
     * Returns the children for every parent.
     * @return array the children list. Each array key is a parent item name,
     * and the corresponding array value is a list of child item names.
     */
    getChildrenList() {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield base_1.ModelManager.AuthItemChild.findAll();
            let parents = {};
            for (const item of items) {
                parents[item["parent"]] = Utils_1.default.concat(parents[item["parent"]] || [], [item["child"]]);
            }
            return parents;
        });
    }
    /**
     * Check whether $userId is empty.
     * @param mixed $userId
     * @return bool
     * @since 2.0.26
     */
    isEmptyUserId(userId) {
        return !userId || userId === '';
    }
    /**
     * Checks whether array of $assignments is empty and [[defaultRoles]] property is empty as well.
     *
     * @param Assignment[] $assignments array of user's assignments
     * @return bool whether array of $assignments is empty and [[defaultRoles]] property is empty as well
     * @since 2.0.11
     */
    hasNoAssignments(assignments) {
        return Utils_1.default.isEmpty(assignments) && Utils_1.default.isEmpty(this.defaultRoles);
    }
}
exports.AuthManager = AuthManager;
AuthManager.TYPE_ROLE = 1;
AuthManager.TYPE_PERMISSION = 2;
//# sourceMappingURL=AuthManager.js.map