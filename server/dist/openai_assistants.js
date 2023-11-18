"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIds = void 0;
const openai_1 = __importDefault(require("openai"));
const client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
/*
  Internal functions
*/
async function createAssistant(name, gptmodel) {
    // Not passing in tools and instructions for now. Can be done later when running the thread as well
    // Instructions also change when data changes... so maybe generally not a good idea
    const response = await client.beta.assistants.create({
        name: 'test-assistant',
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
async function createIds(name, gptmodel) {
    const assistantId = await createAssistant(name, gptmodel);
    const threadId = await createThread();
    return { assistantId, threadId };
}
exports.createIds = createIds;
//# sourceMappingURL=openai_assistants.js.map