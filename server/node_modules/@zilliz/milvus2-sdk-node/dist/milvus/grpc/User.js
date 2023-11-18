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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Resource_1 = require("./Resource");
const __1 = require("../");
class User extends Resource_1.Resource {
    /**
     * Create user in milvus
     *
     * @param data
     *  | Property | Type  | Description |
     *  | :-- | :-- | :-- |
     *  | username | String | username |
     *  | password | String | user password |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | error_code | Error code number |
     *  | reason | Error cause|
     *
     * #### Example
     *
     * ```
     *  milvusClient.createUser({
     *    username: NAME,
     *    password: PASSWORD,
     *  });
     * ```
     */
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.username === undefined || data.password === undefined) {
                throw new Error(__1.ERROR_REASONS.USERNAME_PWD_ARE_REQUIRED);
            }
            const encryptedPassword = (0, __1.stringToBase64)(data.password);
            const promise = yield (0, __1.promisify)(this.client, 'CreateCredential', {
                username: data.username,
                password: encryptedPassword,
            }, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * Update user in milvus
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | username | String | username |
     *  | password | String | user password |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | error_code | Error code number |
     *  | reason | Error cause|
     *
     * #### Example
     *
     * ```
     *  milvusClient.updateUser({
     *    username: NAME,
     *    newPassword: PASSWORD,
     *    oldPassword: PASSWORD,
     *  });
     * ```
     */
    updateUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.username === undefined ||
                data.newPassword === undefined ||
                data.oldPassword === undefined) {
                throw new Error(__1.ERROR_REASONS.USERNAME_PWD_ARE_REQUIRED);
            }
            const encryptedOldPwd = (0, __1.stringToBase64)(data.oldPassword);
            const encryptedNewPwd = (0, __1.stringToBase64)(data.newPassword);
            const promise = yield (0, __1.promisify)(this.client, 'UpdateCredential', {
                username: data.username,
                oldPassword: encryptedOldPwd,
                newPassword: encryptedNewPwd,
            }, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * Delete user in milvus
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | username | String | username |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | error_code | Error code number |
     *  | reason | Error cause|
     *
     * #### Example
     *
     * ```
     *  milvusClient.deleteUser({
     *    username: NAME,
     *  });
     * ```
     */
    deleteUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.username) {
                throw new Error(__1.ERROR_REASONS.USERNAME_IS_REQUIRED);
            }
            const promise = yield (0, __1.promisify)(this.client, 'DeleteCredential', {
                username: data.username,
            }, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * List user in milvus
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | usernames | string[] |
     *
     * #### Example
     *
     * ```
     *  milvusClient.listUsers();
     * ```
     */
    listUsers(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'ListCredUsers', {}, (data === null || data === void 0 ? void 0 : data.timeout) || this.timeout);
            return promise;
        });
    }
    /**
     * Create user role
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | roleName | String | role name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | reason | '' |
     *
     * #### Example
     *
     * ```
     *  milvusClient.createRole({roleName: 'myrole'});
     * ```
     */
    createRole(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'CreateRole', {
                entity: { name: data.roleName },
            }, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * Drop user role
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | roleName | String | User name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | reason | '' |
     *
     * #### Example
     *
     * ```
     *  milvusClient.dropRole({roleName: 'myrole'});
     * ```
     */
    dropRole(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'DropRole', {
                role_name: data.roleName,
            }, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * add user to role
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | username | String | User name |
     *  | roleName | String | Role name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | reason | '' |
     *
     * #### Example
     *
     * ```
     *  milvusClient.addUserToRole({username: 'my', roleName: 'myrole'});
     * ```
     */
    addUserToRole(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'OperateUserRole', {
                username: data.username,
                role_name: data.roleName,
                type: __1.OperateUserRoleType.AddUserToRole,
            }, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * remove user from role
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | username | String | User name |
     *  | roleName | String | Role name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | reason | '' |
     *
     * #### Example
     *
     * ```
     *  milvusClient.removeUserFromRole({username: 'my', roleName: 'myrole'});
     * ```
     */
    removeUserFromRole(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'OperateUserRole', {
                username: data.username,
                role_name: data.roleName,
                type: __1.OperateUserRoleType.RemoveUserFromRole,
            }, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * gets all users that belong to a specified role
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | roleName | String | Role name |
     *  | includeUserInfo? | boolean | should result including user info, by default: true |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined       |
  
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | results | { users: {name: string}[]; role: {name: string} }[] |
     *
     * #### Example
     *
     * ```
     *  milvusClient.selectRole({roleName: 'myrole'});
     * ```
     */
    selectRole(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'SelectRole', {
                role: { name: data.roleName },
                include_user_info: data.includeUserInfo || true,
            }, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * list all roles
     *
     *  @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined       |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | reason | '' |
     *
     * #### Example
     *
     * ```
     *  milvusClient.listRoles();
     * ```
     */
    listRoles(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'SelectRole', {
                include_user_info: (data === null || data === void 0 ? void 0 : data.includeUserInfo) || true,
            }, (data === null || data === void 0 ? void 0 : data.timeout) || this.timeout);
            return promise;
        });
    }
    /**
     * gets all users that belong to a specified role
     *
     *  @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | userName | String | User name |
     *  | includeUserInfo? | boolean | should result including user info, by default: true |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined       |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | results | user: {name: string}; roles: {name: string}[] |
     *
     * #### Example
     *
     * ```
     *  milvusClient.selectUser({username: 'name'});
     * ```
     */
    selectUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'SelectUser', {
                user: { name: data.username },
                include_role_info: data.includeRoleInfo || true,
            }, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * grant privileges to a role
     *
     *  @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | roleName | String | Role name |
     *  | object | string | Type of the operational object to which the specified privilege belongs, such as Collection, Index, Partition, etc. This parameter is case-sensitive.|
     *  | objectName | string | Name of the object to which the role is granted the specified prvilege. |
     *  | privilegeName | string | Name of the privilege to be granted to the role. This parameter is case-sensitive. |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined       |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | reason | '' |
     *
     * #### Example
     *
     * ```
     *  milvusClient.grantRolePrivilege({
     *    roleName: 'roleName',
     *    object: '*',
     *    objectName: 'Collection',
     *    privilegeName: 'CreateIndex'
     * });
     * ```
     */
    grantRolePrivilege(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'OperatePrivilege', {
                entity: {
                    role: { name: data.roleName },
                    object: { name: data.object },
                    object_name: data.objectName,
                    grantor: {
                        privilege: { name: data.privilegeName },
                    },
                },
                type: __1.OperatePrivilegeType.Grant,
            }, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * revoke privileges to a role
     *
     *  @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | roleName | String | Role name |
     *  | object | string | Type of the operational object to which the specified privilege belongs, such as Collection, Index, Partition, etc. This parameter is case-sensitive.|
     *  | objectName | string | Name of the object to which the role is granted the specified prvilege. |
     *  | privilegeName | string | Name of the privilege to be granted to the role. This parameter is case-sensitive. |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined       |
     *
     * @returns
     *  | Property | Description |
     *  | :------------- | :-------- |
     *  | status | { error_code: number, reason: string } |
     *  | reason | '' |
     *
     * #### Example
     *
     * ```
     *  milvusClient.grantRolePrivilege({
     *    roleName: 'roleName',
     *    object: '*',
     *    objectName: 'Collection',
     *    privilegeName: 'CreateIndex'
     * });
     * ```
     */
    revokeRolePrivilege(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'OperatePrivilege', {
                entity: {
                    role: { name: data.roleName },
                    object: { name: data.object },
                    object_name: data.objectName,
                    grantor: {
                        privilege: { name: data.privilegeName },
                    },
                },
                type: __1.OperatePrivilegeType.Revoke,
            }, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * revoke all roles priviledges
     *  @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | reason | '' |
     *
     * #### Example
     *
     * ```
     *  milvusClient.revokeAllRolesPrivileges();
     * ```
     */
    /* istanbul ignore next */
    dropAllRoles(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // find all roles
            const res = yield this.listRoles({ timeout: data === null || data === void 0 ? void 0 : data.timeout });
            const promises = [];
            // iterate through roles
            for (let i = 0; i < res.results.length; i++) {
                const r = res.results[i];
                // get all grants that specific to the role
                const grants = yield this.listGrants({
                    roleName: r.role.name,
                });
                // iterate throught these grant
                for (let j = 0; j < grants.entities.length; j++) {
                    const entity = grants.entities[j];
                    // revoke grant
                    yield this.revokeRolePrivilege({
                        roleName: entity.role.name,
                        object: entity.object.name,
                        objectName: entity.object_name,
                        privilegeName: entity.grantor.privilege.name,
                        timeout: data === null || data === void 0 ? void 0 : data.timeout,
                    });
                }
                promises.push(
                // drop the role
                yield this.dropRole({
                    roleName: r.role.name,
                    timeout: data === null || data === void 0 ? void 0 : data.timeout,
                }));
            }
            return promises;
        });
    }
    /**
     * select a grant
     *  @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | roleName | String | Role name |
     *  | object | string | Type of the operational object to which the specified privilege belongs, such as Collection, Index, Partition, etc. This parameter is case-sensitive.|
     *  | objectName | string | Name of the object to which the role is granted the specified prvilege. |
     *  | privilegeName | string | Name of the privilege to be granted to the role. This parameter is case-sensitive. |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined       |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | reason | '' |
     *
     * #### Example
     *
     * ```
     *  milvusClient.selectGrant({
     *    roleName: 'roleName',
     *    object: '*',
     *    objectName: 'Collection',
     *    privilegeName: 'CreateIndex'
     * });
     * ```
     */
    selectGrant(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'SelectGrant', {
                entity: {
                    role: { name: data.roleName },
                    object: { name: data.object },
                    object_name: data.objectName,
                    grantor: {
                        privilege: { name: data.privilegeName },
                    },
                },
            }, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * list all grants for a role
     *  @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | roleName | String | Role name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined       |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | reason | '' |
     *
     * #### Example
     *
     * ```
     *  milvusClient.listGrants({
     *    roleName: 'roleName',
     * });
     * ```
     */
    listGrants(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'SelectGrant', {
                entity: {
                    role: { name: data.roleName },
                },
            }, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * check if the role is existing
     *  @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | roleName | String | Role name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined       |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | reason | '' |
     *
     * #### Example
     *
     * ```
     *  milvusClient.hasRole({
     *    roleName: 'roleName',
     * });
     * ```
     */
    hasRole(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.listRoles();
            return {
                status: result.status,
                hasRole: result.results.map(r => r.role.name).includes(data.roleName),
            };
        });
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map