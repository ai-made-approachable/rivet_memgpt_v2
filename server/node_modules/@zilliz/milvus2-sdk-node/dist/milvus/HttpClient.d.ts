import { HttpClientConfig, FetchOptions } from './types';
/**
 * HttpBaseClient is a base class for making HTTP requests to a Milvus server.
 * It provides basic functionality for making GET and POST requests, and handles
 * configuration, headers, and timeouts.
 *
 * The HttpClientConfig object should contain the following properties:
 * - endpoint: The URL of the Milvus server.
 * - username: (Optional) The username for authentication.
 * - password: (Optional) The password for authentication.
 * - token: (Optional) The token for authentication.
 * - fetch: (Optional) An alternative fetch API implementation, e.g., node-fetch for Node.js environments.
 * - baseURL: (Optional) The base URL for the API endpoints.
 * - version: (Optional) The version of the API endpoints.
 * - database: (Optional) The default database to use for requests.
 * - timeout: (Optional) The timeout for requests in milliseconds.
 *
 * Note: This is a base class and does not provide specific methods for interacting
 * with Milvus entities like collections or vectors. For that, use the HttpClient class
 * which extends this class and mixes in the Collection and Vector APIs.
 */
export declare class HttpBaseClient {
    config: HttpClientConfig;
    constructor(config: HttpClientConfig);
    get baseURL(): string;
    get authorization(): string;
    get database(): string;
    get timeout(): number;
    get headers(): {
        Authorization: string;
        Accept: string;
        ContentType: string;
    };
    get fetch(): ((input: any, init?: any) => Promise<any>) | typeof fetch;
    POST<T>(url: string, data?: Record<string, any>, options?: FetchOptions): Promise<T>;
    GET<T>(url: string, params?: Record<string, any>, options?: FetchOptions): Promise<T>;
}
declare const HttpClient_base: {
    new (...args: any[]): {
        createCollection(data: import("./types").HttpCollectionCreateReq, options?: FetchOptions | undefined): Promise<import("./types").HttpBaseResponse<{}>>;
        describeCollection(params: import("./types").HttpBaseReq, options?: FetchOptions | undefined): Promise<import("./types").HttpCollectionDescribeResponse>;
        dropCollection(data: import("./types").HttpBaseReq, options?: FetchOptions | undefined): Promise<import("./types").HttpBaseResponse<{}>>;
        listCollections(params?: import("./types").HttpCollectionListReq, options?: FetchOptions | undefined): Promise<import("./types").HttpCollectionListResponse>;
        config: HttpClientConfig;
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
} & {
    new (...args: any[]): {
        get(params: import("./types").HttpVectorGetReq, options?: FetchOptions | undefined): Promise<import("./types").HttpBaseResponse<{}>>;
        insert(data: import("./types").HttpVectorInsertReq, options?: FetchOptions | undefined): Promise<import("./types").HttpVectorInsertResponse>;
        upsert(data: import("./types").HttpVectorInsertReq, options?: FetchOptions | undefined): Promise<import("./types").HttpVectorInsertResponse>;
        query(data: import("./types").HttpVectorQueryReq, options?: FetchOptions | undefined): Promise<import("./types").HttpVectorQueryResponse>;
        search(data: import("./types").HttpVectorSearchReq, options?: FetchOptions | undefined): Promise<import("./types").HttpVectorSearchResponse>;
        delete(data: import("./types").HttpVectorDeleteReq, options?: FetchOptions | undefined): Promise<import("./types").HttpBaseResponse<{}>>;
        config: HttpClientConfig;
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
} & typeof HttpBaseClient;
export declare class HttpClient extends HttpClient_base {
}
export {};
