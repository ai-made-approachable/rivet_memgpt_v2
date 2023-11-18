import { GrpcTimeOut, resStatusResponse } from './Common';
export interface databaseReq extends GrpcTimeOut {
    db_name: string;
}
export interface CreateDatabaseRequest extends databaseReq {
}
export interface DropDatabasesRequest extends databaseReq {
}
export interface ListDatabasesRequest extends GrpcTimeOut {
}
export interface ListDatabasesResponse extends resStatusResponse {
    db_names: string[];
}
