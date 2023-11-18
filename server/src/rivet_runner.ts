import { runGraphInFile, startDebuggerServer } from '@ironclad/rivet-node';
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

const project = './data/memGPTv2';
const debuggerServer = startDebuggerServer({});

export async function runRivet(systemPrompt, threadId, assistantId, message, start) {
    const graph = 'OSUXYaAdV7-UHA0WIUDft'

    return new Promise(async (resolve, reject) => {
        try {
          await runGraphInFile(project + '.rivet-project', {
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
          } as any);
        } catch (error) {
          reject(error);
        }
      });
}