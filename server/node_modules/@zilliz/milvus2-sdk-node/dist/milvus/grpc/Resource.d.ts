import { Partition } from './Partition';
import { ResStatus, GrpcTimeOut, CreateResourceGroupReq, DropResourceGroupsReq, ListResourceGroupsResponse, DescribeResourceGroupsReq, DescribeResourceGroupResponse, TransferNodeReq, TransferReplicaReq } from '../';
export declare class Resource extends Partition {
    /**
     * Create a resource group.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | resource_group | String | Resource group name |
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
     *  new milvusClient(MILUVS_ADDRESS).createResourceGroup({
     *     resource_group: "vector_01",
     *  });
     * ```
     */
    createResourceGroup(data: CreateResourceGroupReq): Promise<ResStatus>;
    /**
     * list resource groups.
     *
     * @returns
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | status.error_code | string | error code |
     *  | status.reason | string | error reason |
     *  | resource_groups | string[] | Resource group string array |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).listResourceGroups();
     * ```
     */
    listResourceGroups(data?: GrpcTimeOut): Promise<ListResourceGroupsResponse>;
    /**
     * Describe a resource group.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | resource_group | String | Resource group name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | status.error_code | string | error code |
     *  | status.reason | string | error reason |
     *  | resource_group.capacity | number | num_node which has been transfer to this rg |
     *  | resource_group.num_available_node | number | available node_num, some node may shutdown |
     *  | resource_group.num_loaded_replica | { [key: string]: number } | from collection_name to loaded replica of each collecion in this rg |
     *  | resource_group.num_outgoing_node | { [key: string]: number } | from collection_name to outgoging accessed node num by replica loaded in this rg |
     *  | resource_group.num_incoming_node | { [key: string]: number } | from collection_name to incoming accessed node num by replica loaded in other rg |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).describeResrouceGroup({
     *    resource_group: 'my-resource-group'
     * });
     * ```
     */
    describeResourceGroup(data: DescribeResourceGroupsReq): Promise<DescribeResourceGroupResponse>;
    /**
     * drop a resource group.
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | resource_group | String | Resource group name |
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
     *  new milvusClient(MILUVS_ADDRESS).dropResourceGroup({
     *    resource_group: 'my-resource-group'
     * });
     * ```
     */
    dropResourceGroup(data: DropResourceGroupsReq): Promise<ResStatus>;
    /**
     * transfer nodes from one resource group to another
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | source_resource_group | String | source resource group name |
     *  | target_resource_group | String | target resource group name |
     *  | collection_name | String | collection name |
     *  | num_replica | Number | number of replicas to transfer |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | status.error_code | string | error code |
     *  | status.reason | string | error reason |
     *
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).transferNode({
     *    source_resource_group: 'source-resource-group',
     *    target_resource_group: 'target-resource-group',
     *    collection_name: 'my-collection',
     *    num_replica: 2
     * });
     * ```
     */
    transferReplica(data: TransferReplicaReq): Promise<ResStatus>;
    /**
     * transfer nodes from one resource group to another
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | source_resource_group | String | source resource group name |
     *  | target_resource_group | String | target resource group name |
     *  | num_node | Number | number of nodes to transfer |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | status.error_code | string | error code |
     *  | status.reason | string | error reason |
     *
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).transferNode({
     *    source_resource_group: 'source-resource-group',
     *    target_resource_group: 'target-resource-group',
     *    num_node: 4
     * });
     * ```
     */
    transferNode(data: TransferNodeReq): Promise<ResStatus>;
    /**
     * drop all resource groups, transfer all nodes to the default group
     *
     * @returns
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | status.error_code | string | error code |
     *  | status.reason | string[] | error reason |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).dropResourceGroups();
     * ```
     */
    dropAllResourceGroups(): Promise<ResStatus[]>;
}
