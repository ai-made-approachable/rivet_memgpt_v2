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
exports.Data = void 0;
const __1 = require("../");
const Collection_1 = require("./Collection");
class Data extends Collection_1.Collection {
    constructor() {
        super(...arguments);
        // vectorTypes
        this.vectorTypes = [__1.DataType.BinaryVector, __1.DataType.FloatVector];
        /**
         * list indexed segments
         *
         * @param data
         *  | Property | Type | Description |
         *  | :-- | :-- | :-- |
         *  | collection_name | string | the name of the collection |
         *  | index_name | string | the name of the collection's index |
         *  | timeout? | number | An optional duration of time in milliseconds to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or an error occurs. Default is undefined |
         *
         * @returns
         *  | Property | Description |
         *  | :-- | :-- |
         *  | status | status |
         *  | segmentIDs | segment IDs |
         *
         * @throws {Error} if `collection_name` property is not present in `data`
         *
         * #### Example
         *
         * ```
         *  new milvusClient(MILUVS_ADDRESS).getPkFieldName({
         *    collection_name: 'my_collection',
         *  });
         * ```
         */
        // async listIndexedSegment(
        //   data: ListIndexedSegmentReq
        // ): Promise<ListIndexedSegmentResponse> {
        //   if (!data || !data.collection_name) {
        //     throw new Error(ERROR_REASONS.COLLECTION_NAME_IS_REQUIRED);
        //   }
        //   const res = await promisify(
        //     this.client,
        //     'ListIndexedSegment',
        //     data,
        //     data.timeout || this.timeout
        //   );
        //   return res;
        // }
        /**
         * describe segment index data
         *
         * @param data
         *  | Property | Type | Description |
         *  | :-- | :-- | :-- |
         *  | collection_name | string | the name of the collection |
         *  | segmentsIDs | number[] | the name of the collection's index |
         *  | timeout? | number | An optional duration of time in milliseconds to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or an error occurs. Default is undefined |
         *
         * @returns
         *  | Property | Description |
         *  | :-- | :-- |
         *  | status | status |
         *  | segmentIDs | segment IDs |
         *
         * @throws {Error} if `collection_name` property is not present in `data`
         *
         * #### Example
         *
         * ```
         *  new milvusClient(MILUVS_ADDRESS).getPkFieldName({
         *    collection_name: 'my_collection',
         *  });
         * ```
         */
        // async describeSegmentIndexData(
        //   data: DescribeSegmentIndexDataReq
        // ): Promise<DescribeSegmentIndexDataResponse> {
        //   if (!data || !data.collection_name) {
        //     throw new Error(ERROR_REASONS.COLLECTION_NAME_IS_REQUIRED);
        //   }
        //   const res = await promisify(
        //     this.client,
        //     'DescribeSegmentIndexData',
        //     data,
        //     data.timeout || this.timeout
        //   );
        //   return res;
        // }
    }
    /**
     * Upsert data into Milvus, view _insert for detail
     */
    upsert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._insert(data, true);
        });
    }
    /**
     * Insert data into Milvus, view _insert for detail
     */
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._insert(data);
        });
    }
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
    _insert(data, upsert = false) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionName)(data);
            // ensure fields data available
            data.fields_data = data.fields_data || data.data;
            if (!data.fields_data ||
                !Array.isArray(data.fields_data) ||
                !data.fields_data.length) {
                throw new Error(__1.ERROR_REASONS.INSERT_CHECK_FIELD_DATA_IS_REQUIRED);
            }
            const { collection_name } = data;
            const collectionInfo = yield this.describeCollection({
                collection_name,
            });
            if (collectionInfo.status.error_code !== __1.ErrorCode.SUCCESS) {
                throw collectionInfo;
            }
            // Tip: The field data sequence needs to be set same as `collectionInfo.schema.fields`.
            // If primarykey is set `autoid = true`, you cannot insert the data.
            const fieldMap = new Map(collectionInfo.schema.fields
                .filter(v => !v.is_primary_key || !v.autoID)
                .map(v => [
                v.name,
                {
                    name: v.name,
                    type: v.data_type,
                    elementType: v.element_type,
                    dim: Number((0, __1.findKeyValue)(v.type_params, 'dim')),
                    data: [], // values container
                },
            ]));
            // dynamic field is enabled, create $meta field
            const isDynamic = collectionInfo.schema.enable_dynamic_field;
            if (isDynamic) {
                fieldMap.set(__1.DEFAULT_DYNAMIC_FIELD, {
                    name: __1.DEFAULT_DYNAMIC_FIELD,
                    type: 'JSON',
                    elementType: 'None',
                    data: [], // value container
                });
            }
            // Loop through each row and set the corresponding field values in the Map.
            data.fields_data.forEach((rowData, rowIndex) => {
                // if support dynamic field, all field not in the schema would be grouped to a dynamic field
                rowData = isDynamic
                    ? (0, __1.buildDynamicRow)(rowData, fieldMap, __1.DEFAULT_DYNAMIC_FIELD)
                    : rowData;
                // get each fieldname from the row object
                const fieldNames = Object.keys(rowData);
                // go through each fieldname and encode or format data
                fieldNames.forEach(name => {
                    const field = fieldMap.get(name);
                    if (!field) {
                        throw new Error(`${__1.ERROR_REASONS.INSERT_CHECK_WRONG_FIELD} ${rowIndex}`);
                    }
                    if (__1.DataTypeMap[field.type] === __1.DataType.BinaryVector &&
                        rowData[name].length !== field.dim / 8) {
                        throw new Error(__1.ERROR_REASONS.INSERT_CHECK_WRONG_DIM);
                    }
                    // build field data
                    switch (__1.DataTypeMap[field.type]) {
                        case __1.DataType.BinaryVector:
                        case __1.DataType.FloatVector:
                            field.data = field.data.concat((0, __1.buildFieldData)(rowData, field));
                            break;
                        default:
                            field.data[rowIndex] = (0, __1.buildFieldData)(rowData, field);
                            break;
                    }
                });
            });
            // The actual data we pass to Milvus gRPC.
            const params = Object.assign(Object.assign({}, data), { num_rows: data.fields_data.length });
            // transform data from map to array, milvus grpc params
            params.fields_data = Array.from(fieldMap.values()).map(field => {
                // milvus return string for field type, so we define the DataTypeMap to the value we need.
                // but if milvus change the string, may cause we cant find value.
                const type = __1.DataTypeMap[field.type];
                const key = this.vectorTypes.includes(type) ? 'vectors' : 'scalars';
                const dataKey = (0, __1.getDataKey)(type);
                const elementType = __1.DataTypeMap[field.elementType];
                const elementTypeKey = (0, __1.getDataKey)(elementType);
                return {
                    type,
                    field_name: field.name,
                    is_dynamic: field.name === __1.DEFAULT_DYNAMIC_FIELD,
                    [key]: type === __1.DataType.FloatVector
                        ? {
                            dim: field.dim,
                            [dataKey]: {
                                data: field.data,
                            },
                        }
                        : type === __1.DataType.BinaryVector
                            ? {
                                dim: field.dim,
                                [dataKey]: (0, __1.parseBinaryVectorToBytes)(field.data),
                            }
                            : type === __1.DataType.Array
                                ? {
                                    [dataKey]: {
                                        data: field.data.map(d => {
                                            return {
                                                [elementTypeKey]: {
                                                    type: elementType,
                                                    data: d,
                                                },
                                            };
                                        }),
                                        element_type: elementType,
                                    },
                                }
                                : {
                                    [dataKey]: {
                                        data: field.data,
                                    },
                                },
                };
            });
            // if timeout is not defined, set timeout to 0
            const timeout = typeof data.timeout === 'undefined' ? 0 : data.timeout;
            // execute Insert
            const promise = yield (0, __1.promisify)(this.client, upsert ? 'Upsert' : 'Insert', params, timeout);
            return promise;
        });
    }
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
    deleteEntities(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.collection_name) {
                throw new Error(__1.ERROR_REASONS.COLLECTION_NAME_IS_REQUIRED);
            }
            // check expr or filter
            if (!data.filter && !data.expr) {
                throw new Error(__1.ERROR_REASONS.FILTER_EXPR_REQUIRED);
            }
            // filter > expr
            data.expr = data.filter || data.expr;
            const promise = yield (0, __1.promisify)(this.client, 'Delete', data, data.timeout || this.timeout);
            return promise;
        });
    }
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
    delete(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.collection_name) {
                throw new Error(__1.ERROR_REASONS.COLLECTION_NAME_IS_REQUIRED);
            }
            if (!data.ids || data.ids.length === 0) {
                throw new Error(__1.ERROR_REASONS.IDS_REQUIRED);
            }
            const pkField = yield this.getPkFieldName(data);
            const pkFieldType = yield this.getPkFieldType(data);
            // generate expr by different type of pk
            const expr = __1.DataTypeMap[pkFieldType] === __1.DataType.VarChar
                ? `${pkField} in ["${data.ids.join('","')}"]`
                : `${pkField} in [${data.ids.join(',')}]`;
            const req = Object.assign(Object.assign({}, data), { expr });
            return this.deleteEntities(req);
        });
    }
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
    search(data) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            // params check
            (0, __1.checkSearchParams)(data);
            try {
                // get collection info
                const collectionInfo = yield this.describeCollection({
                    collection_name: data.collection_name,
                    cache: true,
                });
                // get information from collection info
                let vectorType;
                let defaultOutputFields = [];
                let anns_field;
                for (let i = 0; i < collectionInfo.schema.fields.length; i++) {
                    const f = collectionInfo.schema.fields[i];
                    const type = __1.DataTypeMap[f.data_type];
                    // filter vector field
                    if (type === __1.DataType.FloatVector || type === __1.DataType.BinaryVector) {
                        // anns field
                        anns_field = f.name;
                        // vector type
                        vectorType = type;
                    }
                    else {
                        // save field name
                        defaultOutputFields.push(f.name);
                    }
                }
                // create search params
                const search_params = data.search_params || {
                    anns_field: anns_field,
                    topk: data.limit ||
                        data.topk ||
                        __1.DEFAULT_TOPK,
                    offset: data.offset || 0,
                    metric_type: data.metric_type || '',
                    params: JSON.stringify(data.params || {}),
                    ignore_growing: data.ignore_growing || false,
                };
                // create search vectors
                let searchVectors = data.vectors ||
                    data.data ||
                    data.vector;
                // make sure the searchVectors format is correct
                if (!Array.isArray(searchVectors[0])) {
                    searchVectors = [searchVectors];
                }
                /**
                 *  It will decide the score precision.
                 *  If round_decimal is 3, need return like 3.142
                 *  And if Milvus return like 3.142, Node will add more number after this like 3.142000047683716.
                 *  So the score need to slice by round_decimal
                 */
                const round_decimal = (_b = (_a = data.search_params) === null || _a === void 0 ? void 0 : _a.round_decimal) !== null && _b !== void 0 ? _b : (_c = data.params) === null || _c === void 0 ? void 0 : _c.round_decimal;
                // create placeholder_group
                const PlaceholderGroup = this.milvusProto.lookupType('milvus.proto.common.PlaceholderGroup');
                // tag $0 is hard code in milvus, when dsltype is expr
                const placeholderGroupBytes = PlaceholderGroup.encode(PlaceholderGroup.create({
                    placeholders: [
                        {
                            tag: '$0',
                            type: vectorType,
                            values: searchVectors.map(v => vectorType === __1.DataType.BinaryVector
                                ? (0, __1.parseBinaryVectorToBytes)(v)
                                : (0, __1.parseFloatVectorToBytes)(v)),
                        },
                    ],
                })).finish();
                const promise = yield (0, __1.promisify)(this.client, 'Search', {
                    collection_name: data.collection_name,
                    partition_names: data.partition_names,
                    output_fields: data.output_fields || defaultOutputFields,
                    nq: data.nq || searchVectors.length,
                    dsl: data.expr || data.filter || '',
                    dsl_type: __1.DslType.BoolExprV1,
                    placeholder_group: placeholderGroupBytes,
                    search_params: (0, __1.parseToKeyValue)(search_params),
                    consistency_level: typeof data.consistency_level === 'undefined'
                        ? __1.ConsistencyLevelEnum.Bounded
                        : data.consistency_level,
                }, data.timeout || this.timeout);
                // if search failed
                // if nothing returned
                // return empty with status
                if (promise.status.error_code !== __1.ErrorCode.SUCCESS ||
                    promise.results.scores.length === 0) {
                    return {
                        status: promise.status,
                        results: [],
                    };
                }
                // build final results array
                const results = [];
                const { topks, scores, fields_data, ids } = promise.results;
                // build fields data map
                const fieldsDataMap = (0, __1.buildFieldDataMap)(fields_data);
                // build output name array
                const output_fields = [
                    'id',
                    ...(!!((_d = promise.results.output_fields) === null || _d === void 0 ? void 0 : _d.length)
                        ? promise.results.output_fields
                        : fields_data.map(f => f.field_name)),
                ];
                // vector id support int / str id.
                const idData = ids ? ids[ids.id_field].data : {};
                // add id column
                fieldsDataMap.set('id', idData);
                // fieldsDataMap.set('score', scores); TODO: fieldDataMap to support formatter
                /**
                 * This code block formats the search results returned by Milvus into row data for easier use.
                 * Milvus supports multiple queries to search and returns all columns data, so we need to splice the data for each search result using the `topk` variable.
                 * The `topk` variable is the key we use to splice data for every search result.
                 * The `scores` array is spliced using the `topk` value, and the resulting scores are formatted to the specified precision using the `formatNumberPrecision` function. The resulting row data is then pushed to the `results` array.
                 */
                topks.forEach((v, index) => {
                    const topk = Number(v);
                    scores.splice(0, topk).forEach((score, scoreIndex) => {
                        // get correct index
                        const i = index === 0 ? scoreIndex : scoreIndex + topk * index;
                        // fix round_decimal
                        const fixedScore = typeof round_decimal === 'undefined' || round_decimal === -1
                            ? score
                            : (0, __1.formatNumberPrecision)(score, round_decimal);
                        // init result object
                        const result = { score: fixedScore };
                        // build result,
                        output_fields.forEach(field_name => {
                            // Check if the field_name exists in the fieldsDataMap
                            const isFixedSchema = fieldsDataMap.has(field_name);
                            // Get the data for the field_name from the fieldsDataMap
                            // If the field_name is not in the fieldsDataMap, use the DEFAULT_DYNAMIC_FIELD
                            const data = fieldsDataMap.get(isFixedSchema ? field_name : __1.DEFAULT_DYNAMIC_FIELD);
                            // make dynamic data[i] safe
                            data[i] = isFixedSchema ? data[i] : data[i] || {};
                            // extract dynamic info from dynamic field if necessary
                            result[field_name] = isFixedSchema ? data[i] : data[i][field_name];
                        });
                        // init result slot
                        results[index] = results[index] || [];
                        // push result data
                        results[index].push(result);
                    });
                });
                return {
                    status: promise.status,
                    // if only searching 1 vector, return the first object of results array
                    results: searchVectors.length === 1 ? results[0] || [] : results,
                };
            }
            catch (err) {
                /* istanbul ignore next */
                throw new Error(err);
            }
        });
    }
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
    flush(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data ||
                !Array.isArray(data.collection_names) ||
                !data.collection_names.length) {
                throw new Error(__1.ERROR_REASONS.COLLECTION_NAME_IS_REQUIRED);
            }
            const res = yield (0, __1.promisify)(this.client, 'Flush', data, data.timeout || this.timeout);
            return res;
        });
    }
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
    flushSync(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data ||
                !Array.isArray(data.collection_names) ||
                !data.collection_names.length) {
                throw new Error(__1.ERROR_REASONS.COLLECTION_NAME_IS_REQUIRED);
            }
            // copy flushed collection names
            const res = yield (0, __1.promisify)(this.client, 'Flush', data, data.timeout || this.timeout);
            // After flush will return collection segment ids, need use GetPersistentSegmentInfo to check segment flush status.
            const segIDs = Object.keys(res.coll_segIDs)
                .map(v => res.coll_segIDs[v].data)
                .reduce((pre, cur) => [...pre, ...cur], []);
            let isFlushed = false;
            let flushRes = null;
            while (!isFlushed) {
                flushRes = yield this.getFlushState({ segmentIDs: segIDs });
                yield (0, __1.sleep)(100);
                isFlushed = flushRes.flushed;
            }
            // Before Milvus pre-GA will throw error
            return flushRes;
        });
    }
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
    query(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionName)(data);
            // Set up limits and offset for the query
            let limits;
            let offset;
            if (typeof data.limit === 'number') {
                limits = { limit: data.limit };
            }
            if (typeof data.offset === 'number') {
                offset = { offset: data.offset };
            }
            // filter > expr or empty
            data.expr = data.filter || data.expr || '';
            // Execute the query and get the results
            const promise = yield (0, __1.promisify)(this.client, 'Query', Object.assign(Object.assign({}, data), { query_params: (0, __1.parseToKeyValue)(Object.assign(Object.assign({}, limits), offset)) }), data.timeout || this.timeout);
            // always get output_fields from fields_data
            const output_fields = promise.fields_data.map(f => f.field_name);
            const fieldsDataMap = (0, __1.buildFieldDataMap)(promise.fields_data);
            // For each output field, check if it has a fixed schema or not
            const fieldDataContainer = output_fields.map(field_name => {
                // Check if the field_name exists in the fieldsDataMap
                const isFixedSchema = fieldsDataMap.has(field_name);
                // Get the data for the field_name from the fieldsDataMap
                // If the field_name is not in the fieldsDataMap, use the DEFAULT_DYNAMIC_FIELD
                const data = fieldsDataMap.get(isFixedSchema ? field_name : __1.DEFAULT_DYNAMIC_FIELD);
                // Return an object containing the field_name and its corresponding data
                // If the schema is fixed, use the data directly
                // If the schema is not fixed, map the data to extract the field_name values
                return {
                    data: isFixedSchema ? data : data.map(d => d[field_name]),
                    field_name,
                };
            });
            // Initialize an array to hold the query results
            let results = [];
            // parse column data to [{fieldname:value}]
            results = fieldDataContainer.reduce((acc, v) => {
                v.data.forEach((d, i) => {
                    acc[i] = Object.assign(Object.assign({}, acc[i]), { [v.field_name]: d });
                });
                return acc;
            }, []);
            return {
                status: promise.status,
                data: results,
            };
        });
    }
    count(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryResult = yield this.query({
                collection_name: data.collection_name,
                output_fields: [__1.DEFAULT_COUNT_QUERY_STRING],
            });
            return {
                status: queryResult.status,
                data: Number(queryResult.data[0][__1.DEFAULT_COUNT_QUERY_STRING]),
            };
        });
    }
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
    get(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, __1.checkCollectionName)(data);
            const pkField = yield this.getPkFieldName(data);
            if (!data.ids || data.ids.length === 0) {
                throw new Error(__1.ERROR_REASONS.IDS_REQUIRED);
            }
            const pkFieldType = yield this.getPkFieldType(data);
            // generate expr by different type of pk
            const expr = __1.DataTypeMap[pkFieldType] === __1.DataType.VarChar
                ? `${pkField} in ["${data.ids.join('","')}"]`
                : `${pkField} in [${data.ids.join(',')}]`;
            // build query req
            const req = Object.assign(Object.assign({}, data), { expr });
            return this.query(req);
        });
    }
    /**
     * @ignore
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | request | object | Only allow "system_info" for now |
     */
    getMetric(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.request || !data.request.metric_type) {
                throw new Error(__1.ERROR_REASONS.GET_METRIC_CHECK_PARAMS);
            }
            const res = yield (0, __1.promisify)(this.client, 'GetMetrics', {
                request: JSON.stringify(data.request),
            }, data.timeout || this.timeout);
            return Object.assign(Object.assign({}, res), { response: JSON.parse(res.response) });
        });
    }
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
    getFlushState(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.segmentIDs) {
                throw new Error(__1.ERROR_REASONS.GET_FLUSH_STATE_CHECK_PARAMS);
            }
            const res = yield (0, __1.promisify)(this.client, 'GetFlushState', data, data.timeout || this.timeout);
            return res;
        });
    }
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
    loadBalance(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.src_nodeID) {
                throw new Error(__1.ERROR_REASONS.LOAD_BALANCE_CHECK_PARAMS);
            }
            const res = yield (0, __1.promisify)(this.client, 'LoadBalance', data, data.timeout || this.timeout);
            return res;
        });
    }
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
    getQuerySegmentInfo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.collectionName) {
                throw new Error(__1.ERROR_REASONS.COLLECTION_NAME_IS_REQUIRED);
            }
            const res = yield (0, __1.promisify)(this.client, 'GetQuerySegmentInfo', data, data.timeout || this.timeout);
            return res;
        });
    }
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
    getPersistentSegmentInfo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.collectionName) {
                throw new Error(__1.ERROR_REASONS.COLLECTION_NAME_IS_REQUIRED);
            }
            const res = yield (0, __1.promisify)(this.client, 'GetPersistentSegmentInfo', data, data.timeout || this.timeout);
            return res;
        });
    }
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
    /* istanbul ignore next */
    bulkInsert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.collection_name) {
                throw new Error(__1.ERROR_REASONS.COLLECTION_NAME_IS_REQUIRED);
            }
            if (!data || !data.files) {
                throw new Error(__1.ERROR_REASONS.IMPORT_FILE_CHECK);
            }
            const res = yield (0, __1.promisify)(this.client, 'Import', Object.assign(Object.assign({}, data), { options: data.options || [] }), data.timeout || this.timeout);
            return res;
        });
    }
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
    /* istanbul ignore next */
    listImportTasks(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.collection_name) {
                throw new Error(__1.ERROR_REASONS.COLLECTION_NAME_IS_REQUIRED);
            }
            const res = yield (0, __1.promisify)(this.client, 'ListImportTasks', Object.assign(Object.assign({}, data), { limit: data.limit || 0 }), data.timeout || this.timeout);
            return res;
        });
    }
}
exports.Data = Data;
//# sourceMappingURL=Data.js.map