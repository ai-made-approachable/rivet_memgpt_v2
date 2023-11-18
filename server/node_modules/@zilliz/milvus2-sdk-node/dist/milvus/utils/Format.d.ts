import { Type } from 'protobufjs';
import { KeyValuePair, FieldType, DataTypeMap, DataType, CreateCollectionReq, DescribeCollectionResponse, RowData, Field, FieldData } from '../';
/**
 *  parse [{key:"row_count",value:4}] to {row_count:4}
 * @param data key value pair array
 * @param keys all keys in data
 * @returns {key:value}
 */
export declare const formatKeyValueData: (data: KeyValuePair[], keys: string[]) => {
    [x: string]: any;
};
/**
 * parse {row_count:4} to [{key:"row_count",value:"4"}]
 * @param data Object
 * @returns {KeyValuePair[]}
 */
export declare const parseToKeyValue: (data?: {
    [x: string]: any;
} | undefined) => KeyValuePair[];
/**
 *
 * @param number Number like 3.1738998889923096
 * @param precision The precision you want, if is 3 will return 3.173 and If is 2 will return 3.17
 * @returns
 */
export declare const formatNumberPrecision: (number: number, precision: number) => number;
export declare const checkTimeParam: (ts: any) => boolean;
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
export declare const hybridtsToUnixtime: (hybridts: bigint | string) => string;
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
export declare const unixtimeToHybridts: (unixtime: bigint | string) => string;
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
export declare const datetimeToHybrids: (datetime: Date) => string;
/**
 * Converts a string to base64 encoding.
 * @param str The string to convert.
 * @returns The base64 encoded string.
 */
export declare const stringToBase64: (str: string) => string;
/**
 * Formats the given address by removing the http or https prefix and appending the default Milvus port if necessary.
 * @param address The address to format.
 * @returns The formatted address.
 */
export declare const formatAddress: (address: string) => string;
/**
 * Assigns properties with keys `dim` or `max_length` to the `type_params` object of a `FieldType` object.
 * If the property exists in the `field` object, it is converted to a string and then deleted from the `field` object.
 * If the property already exists in the `type_params` object, it is also converted to a string.
 *
 * @param field The `FieldType` object to modify.
 * @returns The modified `FieldType` object.
 */
export declare const assignTypeParams: (field: FieldType, typeParamKeys?: string[]) => FieldType;
/**
 * Parses a time token and returns the corresponding number of milliseconds.
 *
 * @param {string} token - The time token to parse.
 * @returns {number} The number of milliseconds corresponding to the time token.
 * @throws {Error} If the time token is invalid.
 */
export declare const parseTimeToken: (token: string) => number;
/**
 * Extracts the method name from a URL path.
 *
 * @param {string} query - The URL path to extract the method name from.
 * @returns {string} The extracted method name.
 */
export declare const extractMethodName: (query: string) => string;
/**
 * Converts a `key` of type `keyof typeof DataTypeMap | DataType` to a `DataType`.
 *
 * @param {keyof typeof DataTypeMap | DataType} key - The key to convert.
 * @returns {DataType} The converted `DataType`.
 */
export declare const convertToDataType: (key: keyof typeof DataTypeMap | DataType) => DataType;
/**
 * Creates a deep copy of the provided object using JSON.parse and JSON.stringify.
 * Note that this function is not efficient and may cause performance issues if used with large or complex objects. It also does not handle cases where the object being cloned contains functions or prototype methods.
 *
 * @typeparam T The type of object being cloned.
 * @param {T} obj - The object to clone.
 * @returns {T} A new object with the same properties and values as the original.
 */
export declare const cloneObj: <T>(obj: T) => T;
/**
 * Formats the input data into a request payload for creating a collection.
 *
 * @param {CreateCollectionReq} data - The input data for creating a collection.
 * @param {Type} schemaType - The schema type for the collection.
 * @returns {Object} The formatted request payload.
 */
export declare const formatCollectionSchema: (data: CreateCollectionReq, fieldSchemaType: Type) => {
    [k: string]: any;
};
/**
 * Formats a `DescribeCollectionResponse` object by adding a `dataType` property to each field object in its `schema` array.
 * The `dataType` property represents the numerical value of the `data_type` property.
 *
 * @param {DescribeCollectionResponse} data - The `DescribeCollectionResponse` object to format.
 * @returns {DescribeCollectionResponse} A new `DescribeCollectionResponse` object with the updated `dataType` properties.
 */
export declare const formatDescribedCol: (data: DescribeCollectionResponse) => DescribeCollectionResponse;
/**
 * Builds a dynamic row object by separating the input data into non-dynamic fields and a dynamic field.
 *
 * @param {RowData} rowData - The input data object.
 * @param {Map<string, Field>} fieldMap - A map of field names to field objects.
 * @param {string} dynamicFieldName - The name of the dynamic field.
 * @returns {RowData} The generated dynamic row object.
 */
export declare const buildDynamicRow: (rowData: RowData, fieldMap: Map<string, Field>, dynamicFieldName: string) => RowData;
/**
 * create a data map for each fields, resolve grpc data format
 * If the field is a vector, split the data into chunks of the appropriate size.
 * If the field is a scalar, decode the JSON/array data if necessary.
 */
export declare const buildFieldDataMap: (fields_data: any[]) => Map<string, RowData[]>;
/**
 * Generates an authentication string based on the provided credentials.
 *
 * @param {Object} data - An object containing the authentication credentials.
 * @param {string} [data.username] - The username to use for authentication.
 * @param {string} [data.password] - The password to use for authentication.
 * @param {string} [data.token] - The token to use for authentication.
 * @returns {string} The authentication string.
 */
export declare const getAuthString: (data: {
    username?: string;
    password?: string;
    token?: string;
}) => string;
/**
 * Builds the field data for a given row and column.
 *
 * @param {RowData} rowData - The data for the row.
 * @param {Field} column - The column information.
 * @returns {FieldData} The field data for the row and column.
 */
export declare const buildFieldData: (rowData: RowData, field: Field) => FieldData;
