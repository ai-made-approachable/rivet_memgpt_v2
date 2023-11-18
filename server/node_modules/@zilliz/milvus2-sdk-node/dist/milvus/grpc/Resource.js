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
exports.Resource = void 0;
const Partition_1 = require("./Partition");
const __1 = require("../");
class Resource extends Partition_1.Partition {
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
    createResourceGroup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'CreateResourceGroup', data, data.timeout || this.timeout);
            return promise;
        });
    }
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
    listResourceGroups(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'ListResourceGroups', {}, (data === null || data === void 0 ? void 0 : data.timeout) || this.timeout);
            return promise;
        });
    }
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
    describeResourceGroup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'DescribeResourceGroup', data, data.timeout || this.timeout);
            return promise;
        });
    }
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
    dropResourceGroup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'DropResourceGroup', data, data.timeout || this.timeout);
            return promise;
        });
    }
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
    /* istanbul ignore next */
    transferReplica(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'TransferReplica', data, data.timeout || this.timeout);
            return promise;
        });
    }
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
    /* istanbul ignore next */
    transferNode(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield (0, __1.promisify)(this.client, 'TransferNode', data, data.timeout || this.timeout);
            return promise;
        });
    }
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
    dropAllResourceGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            // get all resource groups
            const { resource_groups } = yield this.listResourceGroups();
            const res = [];
            // iterate over all resource groups
            // find the query nodes in it that need to be transferred
            // transfer those query nodes to the default group
            for (let i = 0; i < resource_groups.length; i++) {
                const sourceRg = resource_groups[i];
                if (sourceRg !== __1.DEFAULT_RESOURCE_GROUP) {
                    // get detail
                    const detail = yield this.describeResourceGroup({
                        resource_group: sourceRg,
                    });
                    // if capacity is not 0, transfer node back
                    if (detail.resource_group.capacity > 0) {
                        // istanbul ignore next
                        yield this.transferNode({
                            source_resource_group: sourceRg,
                            target_resource_group: __1.DEFAULT_RESOURCE_GROUP,
                            num_node: detail.resource_group.capacity,
                        });
                    }
                    // drop rg
                    res.push(yield this.dropResourceGroup({
                        resource_group: sourceRg,
                    }));
                }
            }
            return Promise.all(res);
        });
    }
}
exports.Resource = Resource;
//# sourceMappingURL=Resource.js.map