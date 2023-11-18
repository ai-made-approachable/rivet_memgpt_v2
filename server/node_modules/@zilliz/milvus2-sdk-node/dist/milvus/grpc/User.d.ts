import { Resource } from './Resource';
import { CreateUserReq, DeleteUserReq, ListUsersReq, UpdateUserReq, CreateRoleReq, DropRoleReq, AddUserToRoleReq, RemoveUserFromRoleReq, SelectRoleReq, SelectUserReq, OperateRolePrivilegeReq, SelectGrantReq, ListGrantsReq, HasRoleReq, listRoleReq, GrpcTimeOut, ListCredUsersResponse, ResStatus, SelectRoleResponse, SelectUserResponse, SelectGrantResponse, HasRoleResponse } from '../';
export declare class User extends Resource {
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
    createUser(data: CreateUserReq): Promise<ResStatus>;
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
    updateUser(data: UpdateUserReq): Promise<ResStatus>;
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
    deleteUser(data: DeleteUserReq): Promise<ResStatus>;
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
    listUsers(data?: ListUsersReq): Promise<ListCredUsersResponse>;
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
    createRole(data: CreateRoleReq): Promise<ResStatus>;
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
    dropRole(data: DropRoleReq): Promise<ResStatus>;
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
    addUserToRole(data: AddUserToRoleReq): Promise<ResStatus>;
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
    removeUserFromRole(data: RemoveUserFromRoleReq): Promise<ResStatus>;
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
    selectRole(data: SelectRoleReq): Promise<SelectRoleResponse>;
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
    listRoles(data?: listRoleReq): Promise<SelectRoleResponse>;
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
    selectUser(data: SelectUserReq): Promise<SelectUserResponse>;
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
    grantRolePrivilege(data: OperateRolePrivilegeReq): Promise<ResStatus>;
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
    revokeRolePrivilege(data: OperateRolePrivilegeReq): Promise<ResStatus>;
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
    dropAllRoles(data?: GrpcTimeOut): Promise<ResStatus[]>;
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
    selectGrant(data: SelectGrantReq): Promise<SelectGrantResponse>;
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
    listGrants(data: ListGrantsReq): Promise<SelectGrantResponse>;
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
    hasRole(data: HasRoleReq): Promise<HasRoleResponse>;
}
