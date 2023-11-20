import { globalVars } from './globals.js';
/*
  Internal functions
*/
/*
  External functions
*/
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