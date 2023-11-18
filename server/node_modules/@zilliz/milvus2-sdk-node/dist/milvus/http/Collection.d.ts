import { HttpBaseClient } from '../HttpClient';
import { Constructor } from '../types/index';
import { HttpCollectionCreateReq, HttpCollectionListReq, HttpCollectionListResponse, HttpCollectionDescribeResponse, HttpBaseResponse, HttpBaseReq, FetchOptions } from '../types';
/**
 * Collection is a mixin function that extends the functionality of a base class.
 * It provides methods to interact with collections in a Milvus cluster.
 *
 * @param {Constructor<HttpBaseClient>} Base - The base class to be extended.
 * @returns {class} - The extended class with additional methods for collection management.
 *
 * @method createCollection - Creates a new collection in Milvus.
 * @method describeCollection - Retrieves the description of a specific collection.
 * @method dropCollection - Deletes a specific collection from Milvus.
 * @method listCollections - Lists all collections in the Milvus cluster.
 */
export declare function Collection<T extends Constructor<HttpBaseClient>>(Base: T): {
    new (...args: any[]): {
        createCollection(data: HttpCollectionCreateReq, options?: FetchOptions): Promise<HttpBaseResponse>;
        describeCollection(params: HttpBaseReq, options?: FetchOptions): Promise<HttpCollectionDescribeResponse>;
        dropCollection(data: HttpBaseReq, options?: FetchOptions): Promise<HttpBaseResponse>;
        listCollections(params?: HttpCollectionListReq, options?: FetchOptions): Promise<HttpCollectionListResponse>;
        config: import("../types").HttpClientConfig;
        readonly baseURL: string;
        readonly authorization: string;
        readonly database: string;
        readonly timeout: number;
        readonly headers: {
            Authorization: string;
            Accept: string;
            ContentType: string;
        };
        readonly fetch: ((input: any, init?: any) => Promise<any>) | typeof fetch;
        POST<T>(url: string, data?: Record<string, any>, options?: FetchOptions | undefined): Promise<T>;
        GET<T_1>(url: string, params?: Record<string, any>, options?: FetchOptions | undefined): Promise<T_1>;
    };
} & T;
