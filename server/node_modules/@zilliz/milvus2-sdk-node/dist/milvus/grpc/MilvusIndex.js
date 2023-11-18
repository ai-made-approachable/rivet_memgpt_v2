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
exports.Index = void 0;
const Data_1 = require("./Data");
const __1 = require("../");
class Index extends Data_1.Data {
    /**
     * Create an index on a vector field. Note that index building is an async progress.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | field_name | String | Field name |
     *  | index_name | String | Index name is unique in one collection |
     *  | extra_params | Object | Parameters: { index_type: string; metric_type: string; params: string; }; |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | error_code | Error code number |
     *  | reason | Error cause |
     *
     * @example
     * ```
     * const milvusClient = new MilvusClient(MILUVS_ADDRESS);
     * const createIndexReq = {
     *   collection_name: 'my_collection',
     *   field_name: 'vector_01',
     *   index_name: 'my_index',
     *   index_type: 'IVF_FLAT',
     *   metric_type: 'IP',
     *   params: { nlist: 10 },
     * };
     * const res = await milvusClient.createIndex(createIndexReq);
     * console.log(res);
     * ```
     */
    createIndex(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionName)(data);
            // build extra_params object
            const extra_params = data.extra_params || {};
            // if params set, build params
            if (data.params) {
                extra_params.params = JSON.stringify(data.params);
            }
            // if index_type is set, add it to extra_params
            if (data.index_type) {
                extra_params.index_type = data.index_type;
            }
            // if metric_type is set, add it to extra_params
            if (data.metric_type) {
                extra_params.metric_type = data.metric_type;
            }
            // build create index param
            const createIndexParams = Object.assign(Object.assign({}, data), extra_params);
            // if extra param not empty, overwrite existing
            if (Object.keys(extra_params).length > 0) {
                createIndexParams.extra_params = (0, __1.parseToKeyValue)(extra_params);
            }
            // Call the 'CreateIndex' gRPC method and return the result
            const promise = yield (0, __1.promisify)(this.client, 'CreateIndex', createIndexParams, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * Show index information. Current release of Milvus only supports showing latest built index.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property      | Description |
     *  | :-- | :-- |
     *  | status        |  { error_code: number, reason: string } |
     *  | index_descriptions        | Index information |
     *
     * @example
     * ```
     * const milvusClient = new MilvusClient(MILUVS_ADDRESS);
     * const describeIndexReq = {
     *   collection_name: 'my_collection',
     * };
     * const res = await milvusClient.describeIndex(describeIndexReq);
     * console.log(res);
     * ```
     */
    describeIndex(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionName)(data);
            const promise = yield (0, __1.promisify)(this.client, 'DescribeIndex', data, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * Get the index building state.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | collection_name | string | Collection name |
     *  | timeout? | number | An optional duration of time in milliseconds to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or an error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | state | Index building state |
     *
     * @example
     * ```
     * const milvusClient = new MilvusClient(MILUVS_ADDRESS);
     * const getIndexStateReq = {
     *   collection_name: 'my_collection',
     * };
     * const res = await milvusClient.getIndexState(getIndexStateReq);
     * console.log(res);
     * ```
     */
    getIndexState(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionName)(data);
            const promise = yield (0, __1.promisify)(this.client, 'GetIndexState', data, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * Show index building progress.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | field_name | String | Field name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | indexed_rows | Row count that successfully built with index |
     *  | total_rows | Total row count |
     *
     * @example
     * ```
     * const milvusClient = new MilvusClient(MILUVS_ADDRESS);
     * const getIndexBuildProgressReq = {
     *   collection_name: 'my_collection',
     *   field_name: 'my_field',
     * };
     * const res = await milvusClient.getIndexBuildProgress(getIndexBuildProgressReq);
     * console.log(res);
     * ```
     */
    getIndexBuildProgress(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionName)(data);
            const promise = yield (0, __1.promisify)(this.client, 'GetIndexBuildProgress', data, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * Drop an index.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | field_name | String | Field name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Description |
     *  | :-- | :-- |
     *  | error_code | Error code number |
     *  | reason | Error cause |
     *
     * @example
     * ```
     * const milvusClient = new MilvusClient(MILUVS_ADDRESS);
     * const dropIndexReq = {
     *   collection_name: 'my_collection',
     *   field_name: 'my_field',
     * };
     * const res = await milvusClient.dropIndex(dropIndexReq);
     * console.log(res);
     * ```
     */
    dropIndex(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionName)(data);
            const promise = yield (0, __1.promisify)(this.client, 'DropIndex', data, data.timeout || this.timeout);
            return promise;
        });
    }
}
exports.Index = Index;
//# sourceMappingURL=MilvusIndex.js.map