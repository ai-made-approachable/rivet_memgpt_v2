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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Collection_client;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const __1 = require("..");
// This class represents a collection in Milvus.
class Collection {
    // param
    get param() {
        return { collection_name: this.name };
    }
    // Creates a new `Collection` instance.
    constructor({ name, client }) {
        // The private client that is used to communicate with Milvus.
        _Collection_client.set(this, void 0);
        // pk field name
        this.pkFieldName = '';
        // vector filed name
        this.vectorFieldName = '';
        // vector type
        this.vectorType = __1.DataType.FloatVector;
        // vector dimension
        this.dim = 0;
        // Set the name of the collection.
        this.name = name;
        // Assign the private client.
        __classPrivateFieldSet(this, _Collection_client, client, "f");
    }
    // update key information
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get collection info
            const collectionInfo = yield __classPrivateFieldGet(this, _Collection_client, "f").describeCollection(this.param);
            // extract key information
            for (let i = 0; i < collectionInfo.schema.fields.length; i++) {
                const f = collectionInfo.schema.fields[i];
                const type = __1.DataTypeMap[f.data_type];
                // get pk field info
                if (f.is_primary_key) {
                    this.pkFieldName = f.name;
                }
                // get vector field info
                if (type === __1.DataType.FloatVector || type === __1.DataType.BinaryVector) {
                    // vector field
                    this.vectorFieldName = f.name;
                    // vector type
                    this.vectorType = type;
                    // get dimension
                    this.dim = Number((0, __1.findKeyValue)(f.type_params, 'dim'));
                }
            }
        });
    }
    // Returns the number of entities in the collection.
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the collection statistics from Milvus.
            const stats = yield __classPrivateFieldGet(this, _Collection_client, "f").getCollectionStatistics(this.param);
            // Return the number of entities in the collection.
            return Number(stats.data.row_count);
        });
    }
    // Returns information about the collection, such as its schema.
    info() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get collection info
            const collectionInfo = yield __classPrivateFieldGet(this, _Collection_client, "f").describeCollection(this.param);
            // get Index info
            const indexInfo = yield __classPrivateFieldGet(this, _Collection_client, "f").describeIndex(this.param);
            // combine information and return
            return Object.assign(Object.assign({}, collectionInfo), indexInfo);
        });
    }
    // Loads the collection from disk.
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _Collection_client, "f").loadCollectionSync(this.param);
        });
    }
    // release the collection from memory.
    release() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _Collection_client, "f").releaseCollection(this.param);
        });
    }
    // Creates an index for the collection.
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            // build index req parameters
            return yield __classPrivateFieldGet(this, _Collection_client, "f").createIndex({
                collection_name: this.name,
                field_name: this.vectorFieldName,
                params: {},
            });
        });
    }
    // Searches the collection for entities that match a given query.
    search(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a request object to search the collection.
            const searchSimpleReq = (0, __1.cloneObj)(data);
            searchSimpleReq.collection_name = this.name;
            return yield __classPrivateFieldGet(this, _Collection_client, "f").search(searchSimpleReq);
        });
    }
    // Queries the collection for entities that match a given query.
    query(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a request object to query the collection.
            const queryReq = (0, __1.cloneObj)(data);
            queryReq.collection_name = this.name;
            return yield __classPrivateFieldGet(this, _Collection_client, "f").query(queryReq);
        });
    }
    // Inserts an entity into the collection.
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a request object to insert the entity.
            const insertReq = (0, __1.cloneObj)(data);
            insertReq.collection_name = this.name;
            return yield __classPrivateFieldGet(this, _Collection_client, "f").insert(insertReq);
        });
    }
    // Deletes an entity from the collection.
    delete(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a request object to delete the entity.
            const deleteReq = (0, __1.cloneObj)(data);
            deleteReq.collection_name = this.name;
            return yield __classPrivateFieldGet(this, _Collection_client, "f").delete(deleteReq);
        });
    }
    // get
    get(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a request object to query the collection.
            const getReq = (0, __1.cloneObj)(data);
            getReq.collection_name = this.name;
            return yield __classPrivateFieldGet(this, _Collection_client, "f").get(getReq);
        });
    }
}
exports.Collection = Collection;
_Collection_client = new WeakMap();
//# sourceMappingURL=Collection.js.map