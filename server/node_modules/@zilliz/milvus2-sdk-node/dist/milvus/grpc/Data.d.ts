import { DataType, DeleteEntitiesReq, FlushReq, GetFlushStateReq, GetQuerySegmentInfoReq, GePersistentSegmentInfoReq, InsertReq, LoadBalanceReq, ImportReq, ListImportTasksReq, FlushResult, GetFlushStateResponse, GetMetricsResponse, GetQuerySegmentInfoResponse, GePersistentSegmentInfoResponse, MutationResult, QueryResults, ResStatus, SearchResults, ImportResponse, ListImportTasksResponse, GetMetricsRequest, QueryReq, GetReq, DeleteReq, SearchReq, SearchSimpleReq, CountReq, CountResult } from '../';
import { Collection } from './Collection';
export declare class Data extends Collection {
    vectorTypes: DataType[];
    /**
     * Upsert data into Milvus, view _insert for detail
     */
    upsert(data: InsertReq): Promise<MutationResult>;
    /**
     * Insert data into Milvus, view _insert for detail
     */
    insert(data: InsertReq): Promise<MutationResult>;
    /**
     * Insert/upsert data into Milvus.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | partition_name(optional)| String | Partition name |
     *  | fields_data or data | { [x: string]: any }[] | If the field type is binary, the vector data length needs to be dimension / 8 |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
  
     *
     * @returns
     * | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *  | succ_index |  Index array of the successfully inserted data |
     *  | err_index | Index array of the unsuccessfully inserted data |
     *  | IDs | ID array of the successfully inserted data |
     *
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).insert({
     *    collection_name: COLLECTION_NAME,
     *    fields_data: [{
     *      vector_field: [1,2,2,4],
     *      scalar_field: 1
     *    }]
     *  });
     * ```
     */
    private _insert;
    /**
     * Delete entities in Milvus
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | partition_name(optional)| String | Partition name |
     *  | expr or filter | String | Boolean expression used to filter attribute. |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
  
     *
     * @returns
     * | Property | Description |
     *  | :-- | :-- |
     *  | status |  { error_code: number, reason: string } |
     *  | IDs | ID array of the successfully deleted data |
     *
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).deleteEntities({
     *    collection_name: COLLECTION_NAME,
     *    expr: 'id in [1,2,3,4]'
     *  });
     * ```
     */
    deleteEntities(data: DeleteEntitiesReq): Promise<MutationResult>;
    /**
     * Delete entities in Milvus
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | partition_name(optional)| String | Partition name |
     *  | ids | String[] or Number[] | ids to delete |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
  
     *
     * @returns
     * | Property | Description |
     *  | :-- | :-- |
     *  | status |  { error_code: number, reason: string } |
     *  | IDs | ID array of the successfully deleted data |
     *
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).deleteEntities({
     *    collection_name: COLLECTION_NAME,
     *    expr: 'id in [1,2,3,4]'
     *  });
     * ```
     */
    delete(data: DeleteReq): Promise<MutationResult>;
    /**
     * Perform vector similarity search.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | vectors or data or (vector) | Number[][] or Number[] | Original vector to search with |
     *  | partition_names(optional)| String[] | Array of partition names |
     *  | limit(optional) | number | topk alias |
     *  | topk(optional) | number | topk |
     *  | offset(optional) | number | offset |
     *  | filter(optional) | String | Scalar field filter expression |
     *  | expr(optional) | String | filter alias |
     *  | output_fields(optional) | String[] | Support scalar field |
     *  | metric_type(optional) | String | similarity metric |
     *  | params(optional) | key value object | search params |
     *
     * @returns
     * | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |∂
     *  | results | {score:number,id:string}[]; |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).search({
     *   collection_name: COLLECTION_NAME,
     *   vector: [1, 2, 3, 4],
     *  });
     * ```
     */
    search(data: SearchReq | SearchSimpleReq): Promise<SearchResults>;
    /**
     * Milvus temporarily buffers the newly inserted vectors in the cache. Call `flush()` to persist them to the object storage.
     * It's async function, so it's will take some times to execute.
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | collection_names | String[] | Array of collection names |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
  
     *
     * @returns
     * | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number, reason: string } |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).flush({
     *     collection_names: ['my_collection'],
     *  });
     * ```
     */
    flush(data: FlushReq): Promise<FlushResult>;
    /**
     * It's same function as flush. But flushSync is sync function.
     * So you can ensure it's flushed after function return the result.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | collection_names | String[] | Array of collection names |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
  
     *
     * @returns
     * | Property | Description |
     *  | :-- | :-- |
     *  | status |  { error_code: number, reason: string } |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).flushSync({
     *     collection_names: ['my_collection'],
     *  });
     * ```
     */
    flushSync(data: FlushReq): Promise<GetFlushStateResponse>;
    /**
     * Query vector data in Milvus. Current release of Milvus only supports expression as fieldname in [id1,id2,id3]
     *
     * @param data
     *  | Property | Type  | Description |
     *  | :--- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | expr or filter | String | Scalar field filter expression |
     *  | partitions_names(optional) | String[] | Array of partition names |
     *  | output_fields | String[] | Vector or scalar field to be returned |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
  
     *  | params | {key: value}[] | An optional key pair json array
     *
     * @returns
     * | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number,reason:string } |
     *  | data | Data of all fields that you defined in `output_fields`, {field_name: value}[] |
     *
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).query({
     *    collection_name: 'my_collection',
     *    expr: "age in [1,2,3,4,5,6,7,8]",
     *    output_fields: ["age"],
     *  });
     * ```
     */
    query(data: QueryReq): Promise<QueryResults>;
    count(data: CountReq): Promise<CountResult>;
    /**
     * get vector data by providing ids in Milvus
     *
     * @param data
     *  | Property | Type  | Description |
     *  | :--- | :-- | :-- |
     *  | collection_name | String | Collection name |
     *  | ids | String[] | ids to get |
     *  | partitions_names(optional) | String[] | Array of partition names |
     *  | output_fields | String[] | Vector or scalar field to be returned |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
  
     *  | params | {key: value}[] | An optional key pair json array
     *
     * @returns
     * | Property | Description |
     *  | :-- | :-- |
     *  | status | { error_code: number,reason:string } |
     *  | data | Data of all fields that you defined in `output_fields`, {field_name: value}[] |
     *
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).get({
     *    collection_name: 'my_collection',
     *    ids: [1,2,3,4,5,6,7,8],
     *    output_fields: ["age"],
     *  });
     * ```
     */
    get(data: GetReq): Promise<QueryResults>;
    /**
     * @ignore
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | request | object | Only allow "system_info" for now |
     */
    getMetric(data: GetMetricsRequest): Promise<GetMetricsResponse>;
    /**
     * Get flush state by segment ids
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | segmentIDs | Array | The segment ids |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     * | Property | Description |
     *  | :--- | :-- |
     *  | status | { error_code: number,reason:string } |
     *  | flushed | segments flushed or not |
     *
     *
     * #### Example
     *
     * ```
     *   const res = await milvusClient.getFlushState({
     *    segmentIDs: segIds,
     *   });
     * ```
     */
    getFlushState(data: GetFlushStateReq): Promise<GetFlushStateResponse>;
    /**
     * Do load balancing operation from source query node to destination query node.
     * Only work in cluster milvus.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | src_nodeID | number | The source query node id to balance. |
     *  | dst_nodeIDs | number[] | The destination query node ids to balance.(optional) |
     *  | sealed_segmentIDs | number[] | Sealed segment ids to balance.(optional) |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     * | Property | Description |
     *  | :--- | :-- |
     *  | status | { error_code: number,reason:string } |
     *  | infos | segments information |
     *
     *
     * #### Example
     *
     * ```
     *   const res = await loadBalance({
     *      src_nodeID: 31,
     *   });
     * ```
     */
    loadBalance(data: LoadBalanceReq): Promise<ResStatus>;
    /**
     * Notifies Proxy to return segments information from query nodes.
     *
     * @param data
     *  | Property | Type  | Description |
     *  | :--- | :-- | :-- |
     *  | collectionName | String | The name of the collection to get segments info. |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     *
     * @returns
     * | Property | Description |
     *  | :--- | :-- |
     *  | status | { error_code: number,reason:string } |
     *  | infos | QuerySegmentInfo is the growing segments's information in query cluster. |
     *
     *
     * #### Example
     *
     * ```
     *   const res = await getQuerySegmentInfo({
     *      collectionName: COLLECTION,
     *    });
     * ```
     */
    getQuerySegmentInfo(data: GetQuerySegmentInfoReq): Promise<GetQuerySegmentInfoResponse>;
    /**data
     * Notifies Proxy to return segments information from data nodes.
     *
     * @param data
     *  | Property | Type  | Description |
     *  | :--- | :-- | :-- |
     *  | collectionName | String | The name of the collection to get segments info. |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     *
     * @returns
     * | Property | Description |
     *  | :--- | :-- |
     *  | status | { error_code: number,reason:string } |
     *  | infos | getPersistentSegmentInfo is the growing segments's information in query cluster. |
     *
     *
     * #### Example
     *
     * ```
     *   const res = await getPersistentSegmentInfo({
     *      collectionName: COLLECTION,
     *    });
     * ```
     */
    getPersistentSegmentInfo(data: GePersistentSegmentInfoReq): Promise<GePersistentSegmentInfoResponse>;
    /**
     * Import data from files
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | collection_name | String | The name of the collection |
     *  | files | string[] | File path array |
     *
     *
     * @returns
     * | Property | Description |
     *  | :--- | :-- |
     *  | status | { error_code: number,reason:string } |
     *  | tasks | taskId array |
     *
     *
     * #### Example
     *
     * ```
     *   const res = await bulkInsert({
     *      collection_name: COLLECTION,
     *      files: [`path-to-data-file.json`]
     *    });
     * ```
     */
    bulkInsert(data: ImportReq): Promise<ImportResponse>;
    /**
     * List import tasks
     *
     * @param data
     *  | Property | Type  | Description |
     *  | :--- | :-- | :-- |
     *  | collection_name | String | The name of the collection |
     *  | limit | number | optional, maximum number of tasks returned, list all tasks if the value is 0 |
     *
     *
     * @returns
     * | Property | Description |
     *  | :--- | :-- |
     *  | status | { error_code: number,reason:string } |
     *  | state | import state |
     *  | row_count | how many rows to import|
     *  | id_list| id lists |
     *  | collection_id | collection to be imported to |
     *  | tasks | taskId array  |
     *
     *
     * #### Example
     *
     * ```
     *   const res = await listImportTasks({
     *      collection_name: COLLECTION
     *    });
     * ```
     */
    listImportTasks(data: ListImportTasksReq): Promise<ListImportTasksResponse>;
}
