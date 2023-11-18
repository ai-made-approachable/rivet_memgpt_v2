import { BaseClient } from './BaseClient';
import { CreateDatabaseRequest, ListDatabasesRequest, ListDatabasesResponse, DropDatabasesRequest, ResStatus } from '../';
export declare class Database extends BaseClient {
    /**
     * create a database.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | db_name | String | Database name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | status.error_code | string | error code |
     *  | status.reason | string | error reason |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).listDatabases();
     * ```
     */
    createDatabase(data: CreateDatabaseRequest): Promise<ResStatus>;
    /**
     * List all databases.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | status.error_code | string | error code |
     *  | status.reason | string | error reason |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).listDatabases();
     * ```
     */
    listDatabases(data?: ListDatabasesRequest): Promise<ListDatabasesResponse>;
    /**
     * drop a database.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | db_name | String | Database name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | status.error_code | string | error code |
     *  | status.reason | string | error reason |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).listDatabases();
     * ```
     */
    dropDatabase(data: DropDatabasesRequest): Promise<ResStatus>;
}
