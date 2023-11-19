import OpenAI from 'openai';
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
/*
  Internal functions
*/
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
/*
  External functions
*/
export async function createIds(name, gptmodel) {
    const assistantId = await createAssistant(name, gptmodel);
    const threadId = await createThread();
    return { assistantId, threadId };
}
export async function updateAssistant(assistantId, tools, systemPrompt) {
    const response = await client.beta.assistants.update(assistantId, {
        instructions: systemPrompt,
        tools: tools
    });
    return response;
}
//# sourceMappingURL=openai_assistants.js.map