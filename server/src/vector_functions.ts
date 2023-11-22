import promises from "fs"
import {
    VectorStoreIndex, 
    SimpleDirectoryReader, 
    VectorIndexRetriever, 
    storageContextFromDefaults, 
    OpenAIEmbedding
} from "llamaindex"

export async function readDocuments() {
    const documents = await new SimpleDirectoryReader().loadData({ directoryPath: "./data" });
    const storageContext = await storageContextFromDefaults({
        persistDir: "./storage",
    });
    const index = await VectorStoreIndex.fromDocuments(documents, { storageContext });
}

export async function searchDocuments() {
    const storageContext = await storageContextFromDefaults({
        persistDir: "./storage",
    });
    const index = await VectorStoreIndex.init({
        storageContext: storageContext
    })
    const retriever = new VectorIndexRetriever({ index: index, similarityTopK: 3 });
    const results = await retriever.retrieve("AirBnB");
}

/*
export async function updateRecallMemoryIndex(role, message, timestamp) {
const object = {
    role: role,
    message: message,
    timestamp: timestamp
}
const storageContext = await storageContextFromDefaults({
    persistDir: "./recallmemorytest",
});
const index = await VectorStoreIndex.init({
storageContext: storageContext
});
doc = new Document(object, doc_id=timestamp)

index.insert(JSON.stringify(object))
}
*/