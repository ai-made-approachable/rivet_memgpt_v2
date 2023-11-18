import { FloatVectors } from '..';
type Fetch = (input: any, init?: any) => Promise<any>;
export type Constructor<T = {}> = new (...args: any[]) => T;
export type FetchOptions = {
    abortController: AbortController;
    timeout: number;
};
type HttpClientConfigBase = {
    database?: string;
    version?: string;
    token?: string;
    username?: string;
    password?: string;
    timeout?: number;
    fetch?: Fetch;
};
type HttpClientConfigAddress = HttpClientConfigBase & {
    endpoint: string;
    baseURL?: string;
};
type HttpClientConfigBaseURL = HttpClientConfigBase & {
    endpoint?: string;
    baseURL: string;
};
export type HttpClientConfig = HttpClientConfigAddress | HttpClientConfigBaseURL;
export interface HttpBaseReq {
    dbName?: string;
    collectionName: string;
}
export interface HttpBaseResponse<T = {}> {
    code: number;
    data: T;
    message?: string;
}
export interface HttpCollectionCreateReq extends HttpBaseReq {
    dimension: number;
    metricType?: string;
    primaryField?: string;
    vectorField?: string;
    description?: string;
}
export interface HttpCollectionListReq extends Omit<HttpBaseReq, 'collectionName'> {
}
type Field = {
    autoId?: boolean;
    description: string;
    primaryKey?: boolean;
    type: string;
};
type Index = {
    fieldName: string;
    indexName: string;
    metricType: string;
};
export interface HttpCollectionDescribeResponse extends HttpBaseResponse<{
    collectionName: string;
    description: string;
    fields: Field[];
    indexes: Index[];
    load: string;
    shardsNum: number;
    enableDynamic: boolean;
}> {
}
export interface HttpCollectionListResponse extends HttpBaseResponse<string[]> {
}
export interface HttpVectorInsertReq extends HttpBaseReq {
    data: Record<string, any>[];
}
export interface HttpVectorInsertResponse extends HttpBaseResponse<{
    insertCount: number;
    insertIds: number | string[];
}> {
}
export interface HttpVectorGetReq extends HttpBaseReq {
    id: number | number[] | string | string[];
    outputFields: string[];
}
export interface HttpVectorDeleteReq extends Omit<HttpVectorGetReq, 'outputFields'> {
}
export interface HttpVectorQueryReq extends HttpBaseReq {
    outputFields: string[];
    filter?: string;
    limit?: number;
    offset?: number;
    params?: Record<string, string | number>;
}
type QueryResult = Record<string, any>[];
export interface HttpVectorQueryResponse extends HttpBaseResponse<QueryResult> {
}
export interface HttpVectorSearchReq extends Omit<HttpVectorQueryReq, 'filter'> {
    vector: FloatVectors;
    filter?: string;
}
export interface HttpVectorSearchResponse extends HttpVectorQueryResponse {
    data: QueryResult & {
        distance: number | string;
    };
}
export {};
