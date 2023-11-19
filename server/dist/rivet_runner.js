import { runGraphInFile, startDebuggerServer } from '@ironclad/rivet-node';
import { EventEmitter } from 'events';
import { plugins, globalRivetNodeRegistry } from '@ironclad/rivet-node';
globalRivetNodeRegistry.registerPlugin(plugins.openai);
EventEmitter.defaultMaxListeners = 20;
const project = './data/memGPTv2';
const debuggerServer = startDebuggerServer({});
export async function runRivet(threadId, assistantId, message, start, loginMessage, gptModel, tools, eventEmitter) {
    const graph = 'OSUXYaAdV7-UHA0WIUDft';
    return new Promise(async (resolve, reject) => {
        try {
            await runGraphInFile(project + '.rivet-project', {
                graph: graph,
                remoteDebugger: debuggerServer,
                inputs: {
                    "thread_id": threadId,
                    "assistant_id": assistantId,
                    "message": message,
                    "start": start,
                    "login_message": { "type": "object", "value": loginMessage },
                    "model": gptModel,
                    // "tools": { "type": "gpt-function[]", "value": tools },
                },
                context: {},
                externalFunctions: {
                    wait_for_response: async (_context, response) => {
                        return new Promise((resolve, reject) => {
                            eventEmitter.once('apiCallComplete', (data) => {
                                console.log('apiCallComplete event received:', data);
                                resolve({ type: "string", value: data });
                            });
                        });
                    }
                },
                onUserEvent: {
                    return_response: (data) => {
                        resolve(data.value);
                    }
                },
                openAiKey: process.env.OPENAI_API_KEY
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
//# sourceMappingURL=rivet_runner.js.map