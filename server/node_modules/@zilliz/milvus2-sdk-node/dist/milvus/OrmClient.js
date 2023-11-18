"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrmClient = void 0;
const _1 = require("./");
const orm_1 = require("./orm");
/**
 * ORM client that extends Milvus client
 */
class OrmClient extends _1.MilvusClient {
    // ORM-like APIs
    /**
     * Creates a new collection with the given name and schema, or returns an existing one with the same name.
     * @param data An object containing the collection name, dimension, schema (optional), enable_dynamic_field (optional), and description (optional).
     * @returns A Collection object representing the newly created or existing collection, and it is indexed and loaded
     */
    collection(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // create collection using high-level API
            yield this.createCollection(data);
            // return collection object
            const col = new orm_1.Collection({ name: data.collection_name, client: this });
            // init 
            yield col.init();
            return col;
        });
    }
    /**
     * Retrieves a list of collections from the Milvus server.
     * @param data An optional object containing parameters for filtering the list of collections.
     * @returns An array of Collection objects representing the collections returned by the server.
     */
    collections(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cols = yield this.showCollections(data);
            return cols.data.map(col => {
                return new orm_1.Collection({ name: col.name, client: this });
            });
        });
    }
}
exports.OrmClient = OrmClient;
//# sourceMappingURL=OrmClient.js.map