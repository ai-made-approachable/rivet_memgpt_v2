import promises from "fs"
import {
    VectorStoreIndex, 
    SimpleDirectoryReader, 
    VectorIndexRetriever, 
    storageContextFromDefaults, 
    KeywordTableIndex, 
    Document,
    KeywordTableRetrieverMode,
    SimpleIndexStore
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