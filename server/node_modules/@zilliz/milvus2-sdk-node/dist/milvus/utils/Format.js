"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFieldData = exports.getAuthString = exports.buildFieldDataMap = exports.buildDynamicRow = exports.formatDescribedCol = exports.formatCollectionSchema = exports.cloneObj = exports.convertToDataType = exports.extractMethodName = exports.parseTimeToken = exports.assignTypeParams = exports.formatAddress = exports.stringToBase64 = exports.datetimeToHybrids = exports.unixtimeToHybridts = exports.hybridtsToUnixtime = exports.checkTimeParam = exports.formatNumberPrecision = exports.parseToKeyValue = exports.formatKeyValueData = void 0;
const __1 = require("../");
/**
 *  parse [{key:"row_count",value:4}] to {row_count:4}
 * @param data key value pair array
 * @param keys all keys in data
 * @returns {key:value}
 */
const formatKeyValueData = (data, keys) => {
    const result = {};
    keys.forEach(k => {
        const value = (0, __1.findKeyValue)(data, k);
        result[k] = value;
    });
    return result;
};
exports.formatKeyValueData = formatKeyValueData;
/**
 * parse {row_count:4} to [{key:"row_count",value:"4"}]
 * @param data Object
 * @returns {KeyValuePair[]}
 */
const parseToKeyValue = (data) => {
    return data
        ? Object.keys(data).reduce((pre, cur) => [...pre, { key: cur, value: data[cur] }], [])
        : [];
};
exports.parseToKeyValue = parseToKeyValue;
/**
 *
 * @param number Number like 3.1738998889923096
 * @param precision The precision you want, if is 3 will return 3.173 and If is 2 will return 3.17
 * @returns
 */
const formatNumberPrecision = (number, precision) => {
    return Number(number
        .toString()
        .split('.')
        .map((v, i) => {
        if (i === 1) {
            return v.slice(0, precision);
        }
        return v;
    })
        .join('.'));
};
exports.formatNumberPrecision = formatNumberPrecision;
const LOGICAL_BITS = BigInt(18);
// const LOGICAL_BITS_MASK = (1 << LOGICAL_BITS) - 1;
const checkTimeParam = (ts) => {
    switch (typeof ts) {
        case 'bigint':
            return true;
        case 'string':
            return isNaN(Number(ts)) ? false : true;
        default:
            return false;
    }
};
exports.checkTimeParam = checkTimeParam;
/**
 * Convert a hybrid timestamp to UNIX Epoch time ignoring the logic part.
 *
 * @param data
 *  | Property          | Type  |           Description              |
 *  | :---------------- | :----  | :-------------------------------  |
 *  | hybridts          | String or BigInt |    The known hybrid timestamp to convert to UNIX Epoch time. Non-negative interger range from 0 to 18446744073709551615.       |
 *
 *
 *
 * @returns
 * | Property | Description |
 *  | :-----------| :-------------------------------  |
 *  | unixtime as string      |  The Unix Epoch time is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT). |
 *
 *
 * #### Example
 *
 * ```
 *   const res = hybridtsToUnixtime("429642767925248000");
 * ```
 */
const hybridtsToUnixtime = (hybridts) => {
    if (!(0, exports.checkTimeParam)(hybridts)) {
        throw new Error(`hybridts ${__1.ERROR_REASONS.TIMESTAMP_PARAM_CHECK}`);
    }
    const timestamp = typeof hybridts === 'bigint' ? hybridts : BigInt(hybridts);
    const physical = timestamp >> LOGICAL_BITS;
    return (physical / BigInt(1000)).toString();
};
exports.hybridtsToUnixtime = hybridtsToUnixtime;
/**
 * Generate a hybrid timestamp based on Unix Epoch time, timedelta and incremental time internval.
 *
 * @param data
 *  | Property          | Type  |           Description              |
 *  | :---------------- | :----  | :-------------------------------  |
 *  | unixtime          | string or bigint |    The known Unix Epoch time used to generate a hybrid timestamp.  The Unix Epoch time is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT).       |
 *
 *
 *
 * @returns
 *  | Property    | Type  |           Description              |
 *  | :-----------| :---   | :-------------------------------  |
 *  | Hybrid timetamp       | String   | Hybrid timetamp is a non-negative interger range from 0 to 18446744073709551615. |
 *
 *
 * #### Example
 *
 * ```
 *   const res = unixtimeToHybridts("429642767925248000");
 * ```
 */
const unixtimeToHybridts = (unixtime) => {
    if (!(0, exports.checkTimeParam)(unixtime)) {
        throw new Error(`hybridts ${__1.ERROR_REASONS.TIMESTAMP_PARAM_CHECK}`);
    }
    const timestamp = typeof unixtime === 'bigint' ? unixtime : BigInt(unixtime);
    const physical = (timestamp * BigInt(1000)) << LOGICAL_BITS;
    return physical.toString();
};
exports.unixtimeToHybridts = unixtimeToHybridts;
/**
 * Generate a hybrid timestamp based on datetime。
 *
 * @param data
 *  | Property          | Type  |           Description              |
 *  | :---------------- | :----  | :-------------------------------  |
 *  | datetime          | Date |    The known datetime used to generate a hybrid timestamp.       |
 *
 *
 *
 * @returns
 *  | Property    | Type  |           Description              |
 *  | :-----------| :---   | :-------------------------------  |
 *  | Hybrid timetamp       | String   | Hybrid timetamp is a non-negative interger range from 0 to 18446744073709551615. |
 *
 *
 * #### Example
 *
 * ```
 *   const res = datetimeToHybrids("429642767925248000");
 * ```
 */
const datetimeToHybrids = (datetime) => {
    if (!(datetime instanceof Date)) {
        throw new Error(`hybridts ${__1.ERROR_REASONS.DATE_TYPE_CHECK}`);
    }
    return (0, exports.unixtimeToHybridts)((datetime.getTime() / 1000).toString());
};
exports.datetimeToHybrids = datetimeToHybrids;
/**
 * Converts a string to base64 encoding.
 * @param str The string to convert.
 * @returns The base64 encoded string.
 */
const stringToBase64 = (str) => Buffer.from(str, 'utf-8').toString('base64');
exports.stringToBase64 = stringToBase64;
/**
 * Formats the given address by removing the http or https prefix and appending the default Milvus port if necessary.
 * @param address The address to format.
 * @returns The formatted address.
 */
const formatAddress = (address) => {
    // remove http or https prefix from address
    return address.replace(/(http|https)*:\/\//, '');
};
exports.formatAddress = formatAddress;
/**
 * Assigns properties with keys `dim` or `max_length` to the `type_params` object of a `FieldType` object.
 * If the property exists in the `field` object, it is converted to a string and then deleted from the `field` object.
 * If the property already exists in the `type_params` object, it is also converted to a string.
 *
 * @param field The `FieldType` object to modify.
 * @returns The modified `FieldType` object.
 */
const assignTypeParams = (field, typeParamKeys = ['dim', 'max_length', 'max_capacity']) => {
    let newField = (0, exports.cloneObj)(field);
    typeParamKeys.forEach(key => {
        if (newField.hasOwnProperty(key)) {
            // if the property exists in the field object, assign it to the type_params object
            newField.type_params = newField.type_params || {};
            newField.type_params[key] = String(newField[key]);
            // delete the property from the field object
            delete newField[key];
        }
        if (newField.type_params && newField.type_params[key]) {
            // if the property already exists in the type_params object, convert it to a string
            newField.type_params[key] = String(newField.type_params[key]);
        }
    });
    return newField;
};
exports.assignTypeParams = assignTypeParams;
/**
 * Parses a time token and returns the corresponding number of milliseconds.
 *
 * @param {string} token - The time token to parse.
 * @returns {number} The number of milliseconds corresponding to the time token.
 * @throws {Error} If the time token is invalid.
 */
const parseTimeToken = (token) => {
    const num = parseInt(token.slice(0, -1));
    const unit = token.slice(-1);
    switch (unit) {
        case 's':
            return num * 1000;
        case 'm':
            return num * 60 * 1000;
        case 'h':
            return num * 60 * 60 * 1000;
        case 'd':
            return num * 24 * 60 * 60 * 1000;
        case 'w':
            return num * 7 * 24 * 60 * 60 * 1000;
        case 'M':
            return num * 30 * 24 * 60 * 60 * 1000;
        case 'Y':
            return num * 365 * 24 * 60 * 60 * 1000;
        default:
            throw new Error(`Invalid time token: ${token}`);
    }
};
exports.parseTimeToken = parseTimeToken;
/**
 * Extracts the method name from a URL path.
 *
 * @param {string} query - The URL path to extract the method name from.
 * @returns {string} The extracted method name.
 */
const extractMethodName = (query) => {
    const parts = query.split('/');
    return parts[parts.length - 1];
};
exports.extractMethodName = extractMethodName;
/**
 * Converts a `key` of type `keyof typeof DataTypeMap | DataType` to a `DataType`.
 *
 * @param {keyof typeof DataTypeMap | DataType} key - The key to convert.
 * @returns {DataType} The converted `DataType`.
 */
const convertToDataType = (key) => {
    if (typeof key === 'string' && key in __1.DataTypeMap) {
        return __1.DataType[key];
    }
    else if (typeof key === 'number' && Object.values(__1.DataType).includes(key)) {
        return key;
    }
    throw new Error(__1.ERROR_REASONS.FIELD_TYPE_IS_NOT_SUPPORT);
};
exports.convertToDataType = convertToDataType;
/**
 * Creates a deep copy of the provided object using JSON.parse and JSON.stringify.
 * Note that this function is not efficient and may cause performance issues if used with large or complex objects. It also does not handle cases where the object being cloned contains functions or prototype methods.
 *
 * @typeparam T The type of object being cloned.
 * @param {T} obj - The object to clone.
 * @returns {T} A new object with the same properties and values as the original.
 */
const cloneObj = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
exports.cloneObj = cloneObj;
/**
 * Formats the input data into a request payload for creating a collection.
 *
 * @param {CreateCollectionReq} data - The input data for creating a collection.
 * @param {Type} schemaType - The schema type for the collection.
 * @returns {Object} The formatted request payload.
 */
const formatCollectionSchema = (data, fieldSchemaType) => {
    const { fields, collection_name, description, enable_dynamic_field, enableDynamicField, partition_key_field, } = data;
    const payload = {
        name: collection_name,
        description: description || '',
        enableDynamicField: !!enableDynamicField || !!enable_dynamic_field,
        fields: fields.map(field => {
            // Assign the typeParams property to the result of parseToKeyValue(type_params).
            const _a = (0, exports.assignTypeParams)(field), { type_params } = _a, rest = __rest(_a, ["type_params"]);
            const dataType = (0, exports.convertToDataType)(field.data_type);
            const createObj = Object.assign(Object.assign({}, rest), { typeParams: (0, exports.parseToKeyValue)(type_params), dataType: (0, exports.convertToDataType)(field.data_type), isPrimaryKey: !!field.is_primary_key, isPartitionKey: !!field.is_partition_key || field.name === partition_key_field });
            // if element type exist and
            if (dataType === __1.DataType.Array &&
                typeof field.element_type !== 'undefined') {
                createObj.elementType = field.element_type;
            }
            if (typeof field.default_value !== 'undefined') {
                const dataKey = (0, __1.getDataKey)(createObj.dataType, true);
                createObj.defaultValue = {
                    [dataKey]: field.default_value,
                };
            }
            return fieldSchemaType.create(createObj);
        }),
    };
    return payload;
};
exports.formatCollectionSchema = formatCollectionSchema;
/**
 * Formats a `DescribeCollectionResponse` object by adding a `dataType` property to each field object in its `schema` array.
 * The `dataType` property represents the numerical value of the `data_type` property.
 *
 * @param {DescribeCollectionResponse} data - The `DescribeCollectionResponse` object to format.
 * @returns {DescribeCollectionResponse} A new `DescribeCollectionResponse` object with the updated `dataType` properties.
 */
const formatDescribedCol = (data) => {
    var _a, _b;
    // clone object
    const newData = (0, exports.cloneObj)(data);
    // add a dataType property which indicate datatype number
    (_b = (_a = newData.schema) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.forEach(f => {
        f.dataType = __1.DataTypeMap[f.data_type];
    });
    return newData;
};
exports.formatDescribedCol = formatDescribedCol;
/**
 * Builds a dynamic row object by separating the input data into non-dynamic fields and a dynamic field.
 *
 * @param {RowData} rowData - The input data object.
 * @param {Map<string, Field>} fieldMap - A map of field names to field objects.
 * @param {string} dynamicFieldName - The name of the dynamic field.
 * @returns {RowData} The generated dynamic row object.
 */
const buildDynamicRow = (rowData, fieldMap, dynamicFieldName) => {
    const originRow = (0, exports.cloneObj)(rowData);
    const row = {};
    // iterate through each key in the input data object
    for (let key in originRow) {
        row[dynamicFieldName] = row[dynamicFieldName] || {}; // initialize the dynamic field object
        if (fieldMap.has(key)) {
            // if the key is in the fieldMap, add it to the non-dynamic fields
            row[key] = originRow[key];
        }
        else {
            const obj = row[dynamicFieldName];
            // otherwise, add it to the dynamic field
            obj[key] = originRow[key];
        }
    }
    return row; // return the generated dynamic row object
};
exports.buildDynamicRow = buildDynamicRow;
/**
 * create a data map for each fields, resolve grpc data format
 * If the field is a vector, split the data into chunks of the appropriate size.
 * If the field is a scalar, decode the JSON/array data if necessary.
 */
const buildFieldDataMap = (fields_data) => {
    const fieldsDataMap = new Map();
    fields_data.forEach((item, i) => {
        var _a;
        // field data
        let field_data;
        // parse vector data
        if (item.field === 'vectors') {
            const key = item.vectors.data;
            const vectorValue = key === 'float_vector'
                ? item.vectors[key].data
                : item.vectors[key].toJSON().data;
            // if binary vector , need use dim / 8 to split vector data
            const dim = ((_a = item.vectors) === null || _a === void 0 ? void 0 : _a.data) === 'float_vector'
                ? Number(item.vectors.dim)
                : Number(item.vectors.dim) / 8;
            field_data = [];
            // parse number[] to number[][] by dim
            vectorValue.forEach((v, i) => {
                const index = Math.floor(i / dim);
                if (!field_data[index]) {
                    field_data[index] = [];
                }
                field_data[index].push(v);
            });
        }
        else {
            // parse scalar data
            const key = item.scalars.data;
            field_data = item.scalars[key].data;
            // we need to handle array element specifically here
            if (key === 'array_data') {
                field_data = field_data.map((f) => {
                    const key = f.data;
                    return key ? f[key].data : [];
                });
            }
            // decode json
            switch (key) {
                case 'json_data':
                    field_data.forEach((buffer, i) => {
                        // console.log(JSON.parse(buffer.toString()));
                        field_data[i] = JSON.parse(buffer.toString());
                    });
                    break;
                default:
                    break;
            }
        }
        // Add the parsed data to the fieldsDataMap
        fieldsDataMap.set(item.field_name, field_data);
    });
    return fieldsDataMap;
};
exports.buildFieldDataMap = buildFieldDataMap;
/**
 * Generates an authentication string based on the provided credentials.
 *
 * @param {Object} data - An object containing the authentication credentials.
 * @param {string} [data.username] - The username to use for authentication.
 * @param {string} [data.password] - The password to use for authentication.
 * @param {string} [data.token] - The token to use for authentication.
 * @returns {string} The authentication string.
 */
const getAuthString = (data) => {
    const { username, password, token } = data;
    // build auth string
    const authString = token ? token : `${username}:${password}`;
    // Encode the username and password as a base64 string.
    let auth = Buffer.from(authString, 'utf-8').toString('base64');
    // if we need to create auth interceptors
    const needAuth = (!!username && !!password) || !!token;
    return needAuth ? auth : '';
};
exports.getAuthString = getAuthString;
/**
 * Builds the field data for a given row and column.
 *
 * @param {RowData} rowData - The data for the row.
 * @param {Field} column - The column information.
 * @returns {FieldData} The field data for the row and column.
 */
const buildFieldData = (rowData, field) => {
    const { type, elementType, name } = field;
    switch (__1.DataTypeMap[type]) {
        case __1.DataType.BinaryVector:
        case __1.DataType.FloatVector:
            return rowData[name];
        case __1.DataType.JSON:
            return Buffer.from(JSON.stringify(rowData[name] || {}));
        case __1.DataType.Array:
            const elementField = Object.assign(Object.assign({}, field), { type: elementType });
            return (0, exports.buildFieldData)(rowData, elementField);
        default:
            return rowData[name];
    }
};
exports.buildFieldData = buildFieldData;
//# sourceMappingURL=Format.js.map