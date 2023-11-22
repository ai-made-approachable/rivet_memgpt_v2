import { globalVars } from './globals.js';
import { updateCoreMemory } from './data.js';
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
export async function send_message(functionArguments, eventEmitter) {
    console.log("Function: send_message");
    // Emit the 'sendMessageDataRetrieved' event with functionArguments as the data
    if (globalVars.start) {
        eventEmitter.emit('sendMessageDataRetrievedStartTrue', functionArguments);
    }
    else {
        eventEmitter.emit('sendMessageDataRetrievedStartFalse', functionArguments);
    }
    // Return a Promise that resolves when the 'apiCallComplete' event is emitted
    return new Promise((resolve) => {
        eventEmitter.on('apiCallComplete', (data) => {
            console.log('apiCallComplete event received');
            const replyObject = {
                success: true,
                user_reply: JSON.stringify(data)
            };
            resolve(replyObject);
        });
    });
}
//# sourceMappingURL=handle_functions.js.map