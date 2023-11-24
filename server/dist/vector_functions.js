import { VectorStoreIndex, SimpleDirectoryReader, VectorIndexRetriever, storageContextFromDefaults, serviceContextFromDefaults, Document } from "llamaindex";
const archivalMemoryDir = "./data/archival_memory";
/*
  Internal functions
*/
function transformResults(results) {
    if (!results) {
        return [];
    }
    return results.map(result => {
        return {
            id: result?.node?.id_,
            text: result?.node?.['text'],
            score: result?.score
        };
    });
}
async function retrieveVectors(dir, amount, query) {
    const storageContext = await storageContextFromDefaults({
        persistDir: dir,
    });
    if (Object.keys(storageContext.vectorStore['data'].embeddingDict).length > 0) {
        // storageContext.vectorStore.data
        const index = await VectorStoreIndex.init({
            storageContext: storageContext
        });
        const retriever = new VectorIndexRetriever({ index: index, similarityTopK: amount });
        const results = await retriever.retrieve(query);
        return results;
    }
    else
        return [];
}
// Not used. Can manually be used to update the general part of archival_memory
async function readDocuments(source = "./data/example_data") {
    const documents = await new SimpleDirectoryReader().loadData({ directoryPath: source });
    const storageContext = await storageContextFromDefaults({
        persistDir: archivalMemoryDir,
    });
    const index = await VectorStoreIndex.fromDocuments(documents, { storageContext });
}
/*
  External functions
*/
export async function archivalMemoryInsert(query, object, name) {
    if (object === "human") {
        // Create a Document instance with your data
        const doc = new Document({ text: JSON.stringify(query) });
        const dir = "./data/databases/" + name + "/archival_memory";
        const storageContext = await storageContextFromDefaults({
            persistDir: dir,
        });
        const serviceContext = await serviceContextFromDefaults();
        // Use VectorStoreIndex.fromDocuments to initialize the index with the document
        const index = await VectorStoreIndex.fromDocuments([doc], {
            storageContext,
            serviceContext
        });
        return true;
    }
    else {
        return false;
    }
}
export async function archivalMemorySearch(query, amount, object, name, page = 0) {
    // object = human/general, name = folder name for database
    let dir = "";
    if (object == "human") {
        dir = "./data/databases/" + name + "/archival_memory";
    }
    else {
        dir = archivalMemoryDir;
    }
    const results = await retrieveVectors(dir, amount, query);
    const transformedResults = transformResults(results);
    return transformedResults;
}
export async function updateRecallMemoryVectorStorage(role, message, timestamp, name) {
    const object = {
        role: role,
        message: message,
        timestamp: timestamp
    };
    // Create a Document instance with your data
    const doc = new Document({ text: JSON.stringify(object), metadata: { timestamp: timestamp } });
    const dir = "./data/databases/" + name + "/recall_memory";
    const storageContext = await storageContextFromDefaults({
        persistDir: dir,
    });
    const serviceContext = await serviceContextFromDefaults(); // Make sure this is correctly implemented
    // Use VectorStoreIndex.fromDocuments to initialize the index with the document
    const index = await VectorStoreIndex.fromDocuments([doc], {
        storageContext,
        serviceContext
    });
    return true;
}
export async function recallMemorySearch(query, amount, name, page = 0) {
    const dir = "./data/databases/" + name + "/recall_memory";
    const results = await retrieveVectors(dir, amount, query);
    const transformedResults = transformResults(results);
    return transformedResults;
}
//# sourceMappingURL=vector_functions.js.map