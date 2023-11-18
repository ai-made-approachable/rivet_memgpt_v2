"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataKey = exports.buildDefaultSchema = exports.sleep = exports.findKeyValue = exports.promisify = void 0;
const __1 = require("../");
/**
 * Promisify a function call with optional timeout
 * @param obj - The object containing the target function
 * @param target - The name of the target function to call
 * @param params - The parameters to pass to the target function
 * @param timeout - Optional timeout in milliseconds
 * @returns A Promise that resolves with the result of the target function call
 */
function promisify(obj, target, params, timeout) {
    // Calculate the deadline for the function call
    const t = timeout === 0 ? 1000 * 60 * 60 * 24 : timeout;
    // Create a new Promise that wraps the target function call
    const res = new Promise((resolve, reject) => {
        try {
            // Call the target function with the provided parameters and deadline
            obj[target](params, { deadline: new Date(Date.now() + t) }, (err, result) => {
                if (err) {
                    // If there was an error, reject the Promise with the error
                    reject(err);
                }
                // Otherwise, resolve the Promise with the result
                resolve(result);
            });
        }
        catch (e) {
            // If there was an exception, throw a new Error
            throw new Error(e);
        }
    }).catch(err => {
        // Return a rejected Promise with the error
        return Promise.reject(err);
    });
    // Return the Promise
    return res;
}
exports.promisify = promisify;
const findKeyValue = (obj, key) => { var _a; return (_a = obj.find(v => v.key === key)) === null || _a === void 0 ? void 0 : _a.value; };
exports.findKeyValue = findKeyValue;
const sleep = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
};
exports.sleep = sleep;
// build default schema
const buildDefaultSchema = (data) => {
    return [
        {
            name: data.primary_field_name,
            data_type: data.id_type,
            is_primary_key: true,
            autoID: data.auto_id,
        },
        {
            name: data.vector_field_name,
            data_type: __1.DataType.FloatVector,
            dim: data.dimension,
        },
    ];
};
exports.buildDefaultSchema = buildDefaultSchema;
function convertToCamelCase(str) {
    return str.replace(/_(.)/g, function (match, letter) {
        return letter.toUpperCase();
    });
}
const getDataKey = (type, camelCase = false) => {
    let dataKey = '';
    switch (type) {
        case __1.DataType.FloatVector:
            dataKey = 'float_vector';
            break;
        case __1.DataType.BinaryVector:
            dataKey = 'binary_vector';
            break;
        case __1.DataType.Double:
            dataKey = 'double_data';
            break;
        case __1.DataType.Float:
            dataKey = 'float_data';
            break;
        case __1.DataType.Int64:
            dataKey = 'long_data';
            break;
        case __1.DataType.Int32:
        case __1.DataType.Int16:
        case __1.DataType.Int8:
            dataKey = 'int_data';
            break;
        case __1.DataType.Bool:
            dataKey = 'bool_data';
            break;
        case __1.DataType.VarChar:
            dataKey = 'string_data';
            break;
        case __1.DataType.Array:
            dataKey = 'array_data';
            break;
        case __1.DataType.JSON:
            dataKey = 'json_data';
            break;
        case __1.DataType.None:
            dataKey = 'none';
            break;
        default:
            throw new Error(`${__1.ERROR_REASONS.INSERT_CHECK_WRONG_DATA_TYPE} "${type}."`);
    }
    return camelCase ? convertToCamelCase(dataKey) : dataKey;
};
exports.getDataKey = getDataKey;
//# sourceMappingURL=Function.js.map