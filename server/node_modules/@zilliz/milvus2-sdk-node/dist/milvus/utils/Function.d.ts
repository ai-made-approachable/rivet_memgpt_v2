import { KeyValuePair, DataType } from '../';
/**
 * Promisify a function call with optional timeout
 * @param obj - The object containing the target function
 * @param target - The name of the target function to call
 * @param params - The parameters to pass to the target function
 * @param timeout - Optional timeout in milliseconds
 * @returns A Promise that resolves with the result of the target function call
 */
export declare function promisify(obj: any, target: string, params: any, timeout: number): Promise<any>;
export declare const findKeyValue: (obj: KeyValuePair[], key: string) => string | number | undefined;
export declare const sleep: (time: number) => Promise<unknown>;
export declare const buildDefaultSchema: (data: {
    dimension: number;
    primary_field_name: string;
    id_type: DataType.Int64 | DataType.VarChar;
    vector_field_name: string;
    auto_id: boolean;
}) => ({
    name: string;
    data_type: DataType.Int64 | DataType.VarChar;
    is_primary_key: boolean;
    autoID: boolean;
    dim?: undefined;
} | {
    name: string;
    data_type: DataType;
    dim: number;
    is_primary_key?: undefined;
    autoID?: undefined;
})[];
export declare const getDataKey: (type: DataType, camelCase?: boolean) => string;
