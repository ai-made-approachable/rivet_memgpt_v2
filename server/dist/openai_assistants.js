import OpenAI from 'openai';
import { send_message } from './handle_functions.js';
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
async function performRunAction(requiredActionObject, eventEmitter) {
    const toolCalls = requiredActionObject.submit_tool_outputs.tool_calls;
    const responses = [];
    for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionArguments = JSON.parse(toolCall.function.arguments);
        const toolCallId = toolCall.id;
        switch (functionName) {
            case 'archival_memory_insert':
                // Handle 'archival_memory_insert'
                break;
            case 'archival_memory_search':
                // Handle 'archival_memory_search'
                break;
            case 'core_memory_append':
                // Handle 'core_memory_append'
                break;
            case 'core_memory_replace':
                // Handle 'core_memory_replace'
                break;
            case 'recall_memory_search':
                // Handle 'recall_memory_search'
                break;
            case 'recall_memory_search_date':
                // Handle 'recall_memory_search_date'
                break;
            case 'send_message':
                const sendMessage = await send_message(functionArguments, eventEmitter);
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
export async function startRun(threadId, model, assistantId, message, eventEmitter) {
    await attachMessageToThread(message, threadId);
    const runId = await createRun(threadId, model, assistantId);
    console.log("Run: " + runId + " started");
    // Do the loop of fetching the runs status
    while (true) {
        await delay(500);
        let runStatus = await retrieveRun(threadId, runId);
        console.log(runStatus.status);
        if (['requires_action'].includes(runStatus.status)) {
            const toolOutputs = await performRunAction(runStatus.required_action, eventEmitter);
            await submitToolsOutput(threadId, runId, toolOutputs);
        }
        else if (['expired', 'failed'].includes(runStatus.status)) {
            console.error(`Run status error: ${runStatus.status}`);
            break;
        }
        else if (runStatus.status === 'completed') {
            console.log("Run completed");
            break;
        }
    }
    cancelRun(threadId, runId);
}
//# sourceMappingURL=openai_assistants.js.map