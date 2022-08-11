import {Component, InvalidConfigException, ModelManager} from "../base";
import {BaseChyz, InvalidArgumentException} from "../index";
import {Utils} from "../requiments/Utils";


interface Role {
    type: number;
    name: string;
    description: string;
    ruleName: string;
    data: string;
    params: string;
}

interface Permission {
    type: number;
    name: string;
    description: string;
    ruleName: string;
    data: string;
    params: string;
}


export class AuthManager extends Component {
    static readonly TYPE_ROLE = 1;
    static readonly TYPE_PERMISSION = 2;

    init() {
        BaseChyz.info("Auth Manager init....")
    }

    /**
     * @var Item[] all auth items (name => Item)
     */
    protected items: any;
    checkAccessAssignments: any = {}
    defaultRoles: any = {}


    /**
     *
     */

    public async checkAccess(userId: number, permissionName: string, params: any[] = []): Promise<boolean> {
        let assignments: any;
        if (!this.checkAccessAssignments[userId.toString()]) {
            assignments = await this.getAssignments(userId);
            this.checkAccessAssignments[userId.toString()] = assignments;
        } else {
            assignments = this.checkAccessAssignments[userId.toString()]
        }


        // BaseChyz.info("assignments",assignments)
        if (this.hasNoAssignments(assignments)) {
            return false;
        }


        return await this.checkAccessRecursive(userId, permissionName, params, assignments);
    }

    async checkAccessFromCache() {


    }

    public async checkAccessRecursive(user: string | number, itemname: string, params: any[], assignments: any): Promise<boolean> {
        let item: any = await this.getItem(itemname);
        if (!item) return false;

        /**
         * @todo
         * Rule test edilmeli
         */

        if (assignments[itemname] || Utils.find(this.defaultRoles, itemname)) {
            return true;
        }

        /**
         * item child
         */
        let parents = await ModelManager.AuthItemChild.findAll({attributes:["parent"], where: {child: itemname}});
        for (const parent of parents) {
            let r = await this.checkAccessRecursive(user, parent.parent, params, assignments);
            if (r) {
                return true;
            }
        }

        return false;

    }

    /**
     *
     * @param name
     */
    public async getItem(name: string) {
        if (!name) return null;

        return await ModelManager.AuthItem.findOne({where: {name: name}})

    }

    public async getItems(type: number) {
        let items: any = {};
        let _items = await ModelManager.AuthItem.findAll({where: {type: type}})
        if (_items)
            _items.forEach((item: any) => {
                items[item["name"]] = item.dataValues as Role;
            })

        return items

    }

    public async getRolesByUser(userId: number) {
        if (this.isEmptyUserId(userId.toString())) {
            return [];
        }


        let roles: any = {}
        let items = await ModelManager.AuthAssignment.findAll({
            where: {
                user_id: userId.toString(),
                '$AuthItemClasses.type$': AuthManager.TYPE_ROLE
            },
            include: [{
                model: ModelManager.AuthItem.model()
            }]
        })
        for (const item of items) {
            for (const i of item.AuthItemClasses)
                roles[i["name"]] = i.dataValues as Role;
        }

        return roles;

    }

    /**
     *
     * @param roleName
     */
    public async getChildRoles(roleName: string) {
        let role = await this.getRole(roleName);
        if (role === null) {
            throw new InvalidArgumentException(`Role "${roleName}" not found.`);
        }
        const result: any = {result: {}};
        await this.getChildrenRecursive(roleName, await this.getChildrenList(), result);
        let roles: any = {};
        roles[roleName] = role;
        let _roles = await this.getRoles();
        let _r: any = {};
        Utils.forEach(_roles, (item: Role) => {
            if (result.result[item.name])
                _r[item.name] = item;
        })


        return Utils.merge(roles, _r);
    }

    /**
     *
     * @param roleName
     */
    public async getPermissionsByRole(roleName: string) {
        let childrenList = this.getChildrenList();
        const result = {result: {}}
        let permissions: any = {}
        await this.getChildrenRecursive(roleName, childrenList, result);
        if (Utils.isEmpty(result.result)) {
            return {};
        }

        let itemResult = await ModelManager.AuthItem.findAll({
            where: {
                type: AuthManager.TYPE_PERMISSION,
                name: Object.keys(result.result)
            }
        });
        for (const itemElement of itemResult) {
            permissions[itemElement["name"]] = itemElement.dataValues as Permission
        }

        return permissions;

    }

    /**
     *
     * @param userId
     */
    public async getPermissionsByUser(userId: number) {

        if (this.isEmptyUserId(userId.toString())) {
            return {};
        }

        let directPermission = await this.getDirectPermissionsByUser(userId);
        let inheritedPermission = await this.getInheritedPermissionsByUser(userId);

        return Utils.merge(directPermission, inheritedPermission);
    }

    /**
     * Returns all permissions that are directly assigned to user.
     * @return Permission[] all direct permissions that the user has. The array is indexed by the permission names.
     */
    protected async getDirectPermissionsByUser(userId: number) {
        let permissions: any = {}
        let result = await ModelManager.AuthAssignment.findAll({
            where: {
                user_id: userId.toString(),
                '$AuthItemClasses.type$': AuthManager.TYPE_PERMISSION
            },
            include: [
                {
                    model: ModelManager.AuthItem.model()
                }
            ]
        })

        for (const resultElement of result) {
            for (const i of resultElement.AuthItemClasses)
                permissions[i["name"]] = i.dataValues as Permission;
        }


        return permissions;
    }

    protected async getInheritedPermissionsByUser(userId: number) {
        let userAssignment = await ModelManager.AuthAssignment.findAll({where: {user_id: userId.toString()}, attributes: ["item_name"]});
        let childrenList = await this.getChildrenList();
        const result: any = {result: {}}
        let permissions: any = {}

        for (const userAssignmentElement of userAssignment) {
            this.getChildrenRecursive(userAssignmentElement.item_name, childrenList, result);
        }

        if (Utils.isEmpty(result.result)) {
            return {};
        }

        let itemResult = await ModelManager.AuthItem.findAll({
            where: {
                type: AuthManager.TYPE_PERMISSION,
                name: Object.keys(result.result)
            }
        });
        for (const itemElement of itemResult) {
            permissions[itemElement["name"]] = itemElement.dataValues as Permission
        }

        return permissions;
    }


    /**
     *
     * @param userId
     */
    public async getItemsByUser(userId: number) {
        let items = await ModelManager.AuthAssignment.findAll({
            where: {
                user_id: userId.toString()
            },
            include: [{
                model: ModelManager.AuthItem.model()
            }]
        })

        return items;
    }


    /**
     * Returns all role assignment information for the specified role.
     * @param $roleName
     */
    public async getUserIdsByRole(roleName: number) {
        if (!roleName) return [];

        return await ModelManager.AuthAssignment.findAll({where: {"item_name": roleName}, attributes: ["user_id"]});
    }


    /**
     * {@inheritdoc}
     */
    public async getRole(name: string) {
        let item: Role = await this.getItem(name);
        return item && item.type == AuthManager.TYPE_ROLE ? item : null;
    }


    /**
     * {@inheritdoc}
     */
    public getRoles() {
        return this.getItems(AuthManager.TYPE_ROLE);
    }

    /**
     * Recursively finds all children and grand children of the specified item.
     * @param string $name the name of the item whose children are to be looked for.
     * @param array $childrenList the child list built via [[getChildrenList()]]
     * @param array $result the children and grand children (in array keys)
     */
    protected getChildrenRecursive(name: string, childrenList: any, model: any) {
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
    public getAssignment(roleName: string, userId: string) {
        if (this.isEmptyUserId(userId)) {
            return [];
        }
        return ModelManager.AuthAssignment.findAll({where: {user_id: userId, items_name: roleName}});

    }

    /**
     *
     */
    public async getAssignments(userId: number) {
        if (this.isEmptyUserId(userId.toString())) {
            return {};
        }

        let assignments: any = {};
        try {

            let as = await ModelManager.AuthAssignment.findAll({where: {user_id: userId.toString()}});
            for (const a of as) {
                assignments[a["item_name"]] = a;
            }
        } catch (e) {
            throw new InvalidConfigException('The user application component must be available to specify roles in AccessRule.');
        }
        return assignments;
    }

    /**
     * Returns the children for every parent.
     * @return array the children list. Each array key is a parent item name,
     * and the corresponding array value is a list of child item names.
     */
    protected async getChildrenList() {
        let items = await ModelManager.AuthItemChild.findAll();
        let parents: any = {};
        for (const item of items) {
            parents[item["parent"]] = Utils.concat(parents[item["parent"]] || [], [item["child"]]);
        }

        return parents
    }

    /**
     * Check whether $userId is empty.
     * @param mixed $userId
     * @return bool
     * @since 2.0.26
     */
    protected isEmptyUserId(userId: string) {
        return !userId || userId === '';
    }

    /**
     * Checks whether array of $assignments is empty and [[defaultRoles]] property is empty as well.
     *
     * @param Assignment[] $assignments array of user's assignments
     * @return bool whether array of $assignments is empty and [[defaultRoles]] property is empty as well
     * @since 2.0.11
     */
    protected hasNoAssignments(assignments: any) {
        return Utils.isEmpty(assignments) && Utils.isEmpty(this.defaultRoles)
    }
}
