import { globalVars } from './globals.js';
import { updateCoreMemory, updateRecallMemory, recallMemorySearchDate } from './data.js';
/*
  Internal functions
*/
/*
  External functions
*/
export async function core_memory_append(functionArguments, db) {
    console.log("Function: core_memory_append, Input: " + functionArguments.inner_monologue);
    const result = await updateCoreMemory("append", functionArguments, db);
    const output = `{
        success: true,
        message: "Appened '${functionArguments.content}' to '${functionArguments.name}' in core memory"
    }`;
    return output;
}
export async function core_memory_replace(functionArguments, db) {
    console.log("Function: core_memory_replace, Input: " + functionArguments.inner_monologue);
    const result = await updateCoreMemory("replace", functionArguments, db);
    const output = `{
        success: true,
        message: "Replaced '${functionArguments.old_content}' by '${functionArguments.new_content}' in '${functionArguments.name}' in core memory"
    }`;
    return output;
}
export async function recall_memory_search_date(functionArguments, db) {
    console.log("Function: recall_memory_search_date");
    const { success, result } = await recallMemorySearchDate(functionArguments, db);
    const output = `{
        success: ${success},
        messages: [
            ${result}
        ]
    }`;
    return output;
}
export async function send_message(functionArguments, eventEmitter, db) {
    console.log("Function: send_message");
    // Emit the 'sendMessageDataRetrieved' event with functionArguments as the data
    if (globalVars.start) {
        eventEmitter.emit('sendMessageDataRetrievedStartTrue', functionArguments);
    }
    else {
        eventEmitter.emit('sendMessageDataRetrievedStartFalse', functionArguments);
    }
    // Save llm reply in recall_memory
    await updateRecallMemory("assistant", functionArguments.message, db);
    // Return a Promise that resolves when the 'apiCallComplete' event is emitted
    return new Promise((resolve) => {
        eventEmitter.on('apiCallComplete', async (data) => {
            // Save user reply in recall_memory
            await updateRecallMemory("user", data, db);
            console.log('apiCallComplete event received');
            const replyObject = {
                success: true,
                user_reply: JSON.stringify(data),
                timestamp: Date.now()
            };
            resolve(replyObject);
        });
    });
}
//# sourceMappingURL=handle_functions.js.map