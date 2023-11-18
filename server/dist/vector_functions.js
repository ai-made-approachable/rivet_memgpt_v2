"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchDocuments = exports.readDocuments = void 0;
const llamaindex_1 = require("llamaindex");
async function readDocuments() {
    const documents = await new llamaindex_1.SimpleDirectoryReader().loadData({ directoryPath: "./data" });
    const storageContext = await (0, llamaindex_1.storageContextFromDefaults)({
        persistDir: "./storage",
    });
    const index = await llamaindex_1.VectorStoreIndex.fromDocuments(documents, { storageContext });
}
exports.readDocuments = readDocuments;
async function searchDocuments() {
    const storageContext = await (0, llamaindex_1.storageContextFromDefaults)({
        persistDir: "./storage",
    });
    const index = await llamaindex_1.VectorStoreIndex.init({
        storageContext: storageContext
    });
    const retriever = new llamaindex_1.VectorIndexRetriever({ index: index, similarityTopK: 3 });
    const results = await retriever.retrieve("AirBnB");
}
exports.searchDocuments = searchDocuments;
//# sourceMappingURL=vector_functions.js.map