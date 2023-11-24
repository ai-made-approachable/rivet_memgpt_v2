import promises from "fs"
import {
    VectorStoreIndex, 
    SimpleDirectoryReader, 
    VectorIndexRetriever, 
    storageContextFromDefaults, 
    OpenAIEmbedding,
    serviceContextFromDefaults,
    Document
} from "llamaindex"

const archivalMemoryDir = "./data/archival_memory"

/*
  Internal functions
*/

function transformResults(results: any[]): { id: any; text: any; score: any; }[] {
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
async function retrieveVectors(dir: string, amount: number, query: string) {
    const storageContext = await storageContextFromDefaults({
        persistDir: dir,
    });
    if (Object.keys(storageContext.vectorStore['data'].embeddingDict).length > 0) {
        // storageContext.vectorStore.data
        const index = await VectorStoreIndex.init({
            storageContext: storageContext
        })
        const retriever = new VectorIndexRetriever({ index: index, similarityTopK: amount });
        const results = await retriever.retrieve(query);

        return results;
    }
    else return []

}

// Not used. Can manually be used to update the general part of archival_memory
async function readDocuments(source: string = "./data/example_data") {
    const documents = await new SimpleDirectoryReader().loadData({ directoryPath: source});
    const storageContext = await storageContextFromDefaults({
        persistDir: archivalMemoryDir,
    });
    const index = await VectorStoreIndex.fromDocuments(documents, { storageContext });
}

/*
  External functions
*/

export async function archivalMemoryInsert(query: string, object: string, name: string) {
    if(object === "human") {
        // Create a Document instance with your data
        const doc = new Document({ text: JSON.stringify(query) });
        const dir = "./data/databases/" + name+ "/archival_memory";
        const storageContext = await storageContextFromDefaults({
            persistDir: dir,
        });
        const serviceContext = await serviceContextFromDefaults();
        // Use VectorStoreIndex.fromDocuments to initialize the index with the document
        const index = await VectorStoreIndex.fromDocuments([doc], {
            storageContext,
            serviceContext
        });
        return true
    } else {
        return false
    }
}

export async function archivalMemorySearch(query: string, amount: number, object: string, name: string, page: number = 0) {
    // object = human/general, name = folder name for database
    let dir = ""
    if(object == "human") {
        dir = "./data/databases/" + name+ "/archival_memory"
    }
    else {
        dir = archivalMemoryDir
    }
    const results = await retrieveVectors(dir, amount, query);
    const transformedResults = transformResults(results);
    return transformedResults
}

export async function updateRecallMemoryVectorStorage(role: string, message: string, timestamp: string, name: string) {
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
    return true
}

export async function recallMemorySearch(query: string, amount: number, name: string, page: number = 0) {
    const dir = "./data/databases/" + name + "/recall_memory";
    const results = await retrieveVectors(dir, amount, query);
    const transformedResults = transformResults(results);
    return transformedResults
}