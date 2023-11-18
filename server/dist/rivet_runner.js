"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRivet = void 0;
const rivet_node_1 = require("@ironclad/rivet-node");
const events_1 = require("events");
events_1.EventEmitter.defaultMaxListeners = 20;
const project = './data/memGPTv2';
const debuggerServer = (0, rivet_node_1.startDebuggerServer)({});
async function runRivet(systemPrompt, threadId, assistantId, message, start) {
    const graph = 'OSUXYaAdV7-UHA0WIUDft';
    return new Promise(async (resolve, reject) => {
        try {
            await (0, rivet_node_1.runGraphInFile)(project + '.rivet-project', {
                graph: graph,
                remoteDebugger: debuggerServer,
                inputs: {
                    "system_prompt": systemPrompt,
                    "thread_id": threadId,
                    "assistant_id": assistantId,
                    "message": message,
                    "start": start
                },
                context: {},
                externalFunctions: {},
                onUserEvent: {},
                openAiKey: process.env.OPENAI_API_KEY
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.runRivet = runRivet;
//# sourceMappingURL=rivet_runner.js.map