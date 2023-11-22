import OpenAI from 'openai';
import { send_message, core_memory_append, core_memory_replace, recall_memory_search_date } from './handle_functions.js';
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
/*
  Internal functions
*/
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function createAssistant(name, gptmodel) {
    // Not passing in tools and instructions for now. Can be done later when running the thread as well
    // Instructions also change when data changes... so maybe generally not a good idea
    const response = await client.beta.assistants.create({
        name: 'memGpt_' + name,
        model: gptmodel,
        tools: [{ type: "code_interpreter" }]
    });
    const assistantId = response.id;
    return assistantId;
}
async function createThread() {
    const response = await client.beta.threads.create({});
    const threadId = response.id;
    return threadId;
}
async function attachMessageToThread(message, threadId) {
    const response = await client.beta.threads.messages.create(threadId, {
        role: "user",
        content: JSON.stringify(message)
    });
    return true;
}
async function createRun(threadId, model, assistantId) {
    const response = await client.beta.threads.runs.create(threadId, {
        model: model,
        assistant_id: assistantId
    });
    const runId = response.id;
    return runId;
}
async function cancelRun(threadId, runId) {
    try {
        const response = await client.beta.threads.runs.cancel(threadId, runId);
        console.log("Run was cancelled");
        return response;
    }
    catch (error) {
        console.log("Run was not cancelled");
        return error;
    }
}
async function retrieveRun(threadId, runId) {
    const response = await client.beta.threads.runs.retrieve(threadId, runId);
    return response;
}
async function submitToolsOutput(threadId, runId, toolOutputs) {
    const response = await client.beta.threads.runs.submitToolOutputs(threadId, runId, {
        tool_outputs: toolOutputs
    });
    console.log(response);
}
async function wrapToolOutput(toolCallId, output) {
    const toolOutput = {
        tool_call_id: toolCallId,
        output: JSON.stringify(output)
    };
    return toolOutput;
}
async function ListAndCancelRuns(threadId) {
    const response = await client.beta.threads.runs.list(threadId);
    const runIds = response.data.map((run) => run.id);
    for (const runId of runIds) {
        await cancelRun(threadId, runId);
    }
}
async function getLastThreadMessage(threadId) {
    const response = await client.beta.threads.messages.list(threadId);
    return response.data[0];
}
async function performRunAction(requiredActionObject, eventEmitter, db) {
    const toolCalls = requiredActionObject.submit_tool_outputs.tool_calls;
    const responses = [];
    for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionArguments = JSON.parse(toolCall.function.arguments);
        console.log(functionArguments);
        const toolCallId = toolCall.id;
        switch (functionName) {
            case 'archival_memory_insert':
                // Handle 'archival_memory_insert'
                console.log("Function: archival_memory_insert");
                break;
            case 'archival_memory_search':
                // Handle 'archival_memory_search'
                console.log("Function: archival_memory_search");
                break;
            case 'core_memory_append':
                const coreMemoryAppend = await core_memory_append(functionArguments, db);
                const coreMemoryAppendOutput = await wrapToolOutput(toolCallId, coreMemoryAppend);
                responses.push(coreMemoryAppendOutput);
                break;
            case 'core_memory_replace':
                const coreMemoryReplace = await core_memory_replace(functionArguments, db);
                const coreMemoryReplaceOutput = await wrapToolOutput(toolCallId, coreMemoryReplace);
                responses.push(coreMemoryReplaceOutput);
                break;
            case 'recall_memory_search':
                // Handle 'recall_memory_search'
                console.log("Function: recall_memory_search");
                break;
            case 'recall_memory_search_date':
                const recallMemorySearchDate = await recall_memory_search_date(functionArguments, db);
                const recallMemorySearchDateOutput = await wrapToolOutput(toolCallId, recallMemorySearchDate);
                responses.push(recallMemorySearchDateOutput);
                debugger;
                break;
            case 'send_message':
                const sendMessage = await send_message(functionArguments, eventEmitter, db);
                const sendMessageOutput = await wrapToolOutput(toolCallId, sendMessage);
                responses.push(sendMessageOutput);
                break;
            default:
                console.error(`Unknown function name: ${functionName}`);
        }
    }
    return responses;
}
/*
  External functions
*/
export async function createIds(name, gptmodel) {
    const assistantId = await createAssistant(name, gptmodel);
    const threadId = await createThread();
    console.log("Attached message to thread: " + threadId);
    return { assistantId, threadId };
}
export async function updateAssistant(assistantId, tools, systemPrompt) {
    const response = await client.beta.assistants.update(assistantId, {
        instructions: systemPrompt,
        tools: tools
    });
    return response;
}
export async function startRun(threadId, model, assistantId, message, eventEmitter, db) {
    // Close old runs first. Otherwise openai might refuse to create a new one
    await ListAndCancelRuns(threadId);
    await attachMessageToThread(message, threadId);
    const runId = await createRun(threadId, model, assistantId);
    console.log("Run: " + runId + " started");
    // Do the loop of fetching the runs status
    while (true) {
        await delay(500);
        let runStatus = await retrieveRun(threadId, runId);
        console.log(runStatus.status);
        if (['requires_action'].includes(runStatus.status)) {
            const toolOutputs = await performRunAction(runStatus.required_action, eventEmitter, db);
            await submitToolsOutput(threadId, runId, toolOutputs);
        }
        else if (['expired', 'failed'].includes(runStatus.status)) {
            console.error(`Run status error: ${runStatus.status}`);
            break;
        }
        else if (runStatus.status === 'completed') {
            // This means that the assistant did not use a function = tried to directly talk to the user.
            const lastMessage = await getLastThreadMessage(threadId);
            console.log("Run completed = no function call... Response:" + JSON.stringify(lastMessage));
            // We need to fix this. 1. Create a new message informing about the error, 2. restarting the run
            message = {
                "success": "error",
                "message": "The user did not get your response. The user can only hear you if you use the 'send_message' function. Please try again."
            };
            debugger;
            startRun(threadId, model, assistantId, message, eventEmitter, db);
            break;
        }
        else if (runStatus.status === 'cancelled') {
            console.log("Run cancelled");
            break;
        }
    }
    cancelRun(threadId, runId);
}
//# sourceMappingURL=openai_assistants.js.map