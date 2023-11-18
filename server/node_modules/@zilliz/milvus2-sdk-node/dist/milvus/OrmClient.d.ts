import { ShowCollectionsReq, CreateColReq, MilvusClient } from './';
import { Collection } from './orm';
/**
 * ORM client that extends Milvus client
 */
export declare class OrmClient extends MilvusClient {
    /**
     * Creates a new collection with the given name and schema, or returns an existing one with the same name.
     * @param data An object containing the collection name, dimension, schema (optional), enable_dynamic_field (optional), and description (optional).
     * @returns A Collection object representing the newly created or existing collection, and it is indexed and loaded
     */
    collection(data: CreateColReq): Promise<Collection>;
    /**
     * Retrieves a list of collections from the Milvus server.
     * @param data An optional object containing parameters for filtering the list of collections.
     * @returns An array of Collection objects representing the collections returned by the server.
     */
    collections(data?: ShowCollectionsReq): Promise<Collection[]>;
}
