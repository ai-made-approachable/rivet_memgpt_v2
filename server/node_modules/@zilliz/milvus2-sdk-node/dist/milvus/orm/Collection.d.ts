import { MilvusClient, InsertReq, SearchSimpleReq, GetReq, DeleteReq, QueryReq, DataType } from '..';
interface collectionProps {
    name: string;
    client: MilvusClient;
}
export declare class Collection {
    #private;
    readonly name: string;
    private get param();
    pkFieldName: string;
    vectorFieldName: string;
    vectorType: DataType;
    dim: number;
    constructor({ name, client }: collectionProps);
    init(): Promise<void>;
    count(): Promise<number>;
    info(): Promise<{
        index_descriptions: import("..").IndexDescription[];
        status: import("..").ResStatus;
        schema: import("..").CollectionSchema;
        collectionID: string;
        consistency_level: string;
        aliases: string[];
        virtual_channel_names: string[];
        physical_channel_names: string[];
        start_positions: string[];
        properties: import("..").KeyValuePair[];
        created_timestamp: string;
        created_utc_timestamp: string;
        shards_num: number;
        num_partitions?: string | undefined;
        db_name: string;
    }>;
    load(): Promise<import("..").ResStatus>;
    release(): Promise<import("..").ResStatus>;
    index(): Promise<import("..").ResStatus>;
    search(data: Omit<SearchSimpleReq, 'collection_name'>): Promise<import("..").SearchResults>;
    query(data: Omit<QueryReq, 'collection_name'>): Promise<import("..").QueryResults>;
    insert(data: Omit<InsertReq, 'collection_name'>): Promise<import("..").MutationResult>;
    delete(data: Omit<DeleteReq, 'collection_name'>): Promise<import("..").MutationResult>;
    get(data: Omit<GetReq, 'collection_name'>): Promise<import("..").QueryResults>;
}
export {};
