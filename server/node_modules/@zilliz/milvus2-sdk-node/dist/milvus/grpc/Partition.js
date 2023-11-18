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
exports.Partition = void 0;
const MilvusIndex_1 = require("./MilvusIndex");
const __1 = require("../");
class Partition extends MilvusIndex_1.Index {
    /**
     * Create a partition in a collection.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | partition_name | String | Partition name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
  
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | error_code | Error code number |
     *  | reason | Error cause |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).createPartition({
     *     collection_name: 'my_collection',
     *     partition_name: 'my_partition',
     *  });
     * ```
     */
    createPartition(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionAndPartitionName)(data);
            const promise = yield (0, __1.promisify)(this.client, 'CreatePartition', data, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * Check if a partition exists in a collection.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | collection_name | string | Collection name |
     *  | partition_name | string | Parititon name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
  
     *
     * @returns
     * | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number,reason:string } |
     *  | value | `true` or `false` |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).hasPartition({
     *     collection_name: 'my_collection',
     *     partition_name: 'my_partition',
     *  });
     * ```
     */
    hasPartition(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionAndPartitionName)(data);
            const promise = yield (0, __1.promisify)(this.client, 'HasPartition', data, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * Show all partitions in a collection.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
  
     *
     * @returns
     * | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | partition_names | Array of partition names |
     *  | partitionIDs | Array of partition IDs |
     *
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).showPartitions({
     *     collection_name: 'my_collection',
     *  });
     * ```
     */
    showPartitions(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionName)(data);
            const promise = yield (0, __1.promisify)(this.client, 'ShowPartitions', data, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * Show the statistics information of a partition.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | partition_name | String | Partition name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
  
     *
     * @returns
     * | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | stats | [{key: string, value: string}] |
     *  | data  | { row_count: 0 } transformed from **stats** |
     *
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).getPartitionStatistics({
     *     collection_name: 'my_collection',
     *     partition_name: "_default",
     *  });
     * ```
     */
    getPartitionStatistics(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionAndPartitionName)(data);
            const promise = yield (0, __1.promisify)(this.client, 'GetPartitionStatistics', data, data.timeout || this.timeout);
            promise.data = (0, __1.formatKeyValueData)(promise.stats, ['row_count']);
            return promise;
        });
    }
    /**
     * Load multiple partitions into query nodes.
     *
     * @param data
     *  | Property | Type  | Description |
     *  | :--- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | partition_names | String[] | Array of partition names |
     *  | replica_number? | number | replica number |
     *  | resource_groups | String[] | resource group names |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | error_code | Error code number |
     *  | reason | Error cause |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).loadPartitions({
     *     collection_name: 'my_collection',
     *     partition_names: ['my_partition'],
     *  });
     * ```
     */
    loadPartitions(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionName)(data);
            if (!Array.isArray(data.partition_names) || !data.partition_names.length) {
                throw new Error(__1.ERROR_REASONS.PARTITION_NAMES_IS_REQUIRED);
            }
            const promise = yield (0, __1.promisify)(this.client, 'LoadPartitions', data, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * Release a partition from cache.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | partition_names | String[] | Array of partition names |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
  
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | error_code | Error code number |
     *  | reason | Error cause |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).releasePartitions({
     *     collection_name: 'my_collection',
     *     partition_names: ['my_partition'],
     *  });
     * ```
     */
    releasePartitions(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionName)(data);
            if (!Array.isArray(data.partition_names) || !data.partition_names.length) {
                throw new Error(__1.ERROR_REASONS.PARTITION_NAMES_IS_REQUIRED);
            }
            const promise = yield (0, __1.promisify)(this.client, 'ReleasePartitions', data, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * Drop a partition. Note that it will drop all data in the partition.
     * Default partition cannot be droped.
     * @param data
     * @returns
     */
    /**
     * To drop a partition will drop all data in this partition and the `_default` partition cannot be dropped.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | partition_name | String | Partition name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
  
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | error_code | Error code number |
     *  | reason | Error cause |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).dropPartition({
     *     collection_name: 'my_collection',
     *     partition_name: 'my_partition',
     *  });
     * ```
     */
    dropPartition(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionAndPartitionName)(data);
            const promise = yield (0, __1.promisify)(this.client, 'DropPartition', data, data.timeout || this.timeout);
            return promise;
        });
    }
}
exports.Partition = Partition;
//# sourceMappingURL=Partition.js.map