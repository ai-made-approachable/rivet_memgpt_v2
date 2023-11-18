"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveApi = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const data_1 = require("./data");
const system_prompt_1 = require("./system_prompt");
const rivet_runner_1 = require("./rivet_runner");
const readDir = util_1.default.promisify(fs_1.default.readdir);
const readFile = util_1.default.promisify(fs_1.default.readFile);
async function generateOptions() {
    const directoryPath = './data';
    const folders = ["humans", "personas", "prompts", "tools"];
    const config = {};
    await Promise.all(folders.map(async (folder) => {
        const files = await readDir(directoryPath + "/" + folder);
        config[folder] = files;
    }));
    const gptModelsContent = await readFile(directoryPath + "/gpt_models.json");
    const gptModels = JSON.parse(gptModelsContent.toString());
    config["gptmodels"] = gptModels;
    // Add empty object to identifiy the thread/configuration if there is already one. Needs to come from db later
    return config;
}
async function chatRequest(request) {
    // Check if configuration exists
    const configs = await (0, data_1.retrieveConfigurations)();
    if (configs.includes(request.name)) {
        // Wait for the data to be retrieved before proceeding
        const data = await (0, data_1.retrieveData)(request.name);
        // Now call createSystemPrompt with the retrieved data
        const systemPrompt = await (0, system_prompt_1.createSystemPrompt)(data);
        const threadId = data["thread"];
        const assistantId = data["assistant"];
        const response = (0, rivet_runner_1.runRivet)(systemPrompt, threadId, assistantId, request.message, request.start);
        return true;
    }
    else {
        return false;
    }
}
class serveApi {
    constructor() {
        const startServer = async () => {
            const options = await generateOptions();
            const app = (0, express_1.default)();
            app.use(express_1.default.json());
            const PORT = 8085;
            app.listen(PORT, () => console.log('Listening on http://localhost:' + PORT));
            // options = get all available files/options that can be selected for a configuration
            app.get('/options', async (req, res) => {
                return res.status(200).send({ options });
            });
            // configs = get all available configurations
            app.get('/configs', async (req, res) => {
                const configs = await (0, data_1.retrieveConfigurations)();
                console.log(configs);
                return res.status(200).send({ configs });
            });
            // save = create new configuration + database + thread/assistant... needs to be renamed
            app.post('/save', async (req, res) => {
                if (req.body.gptmodel && req.body.human && req.body.name && req.body.persona && req.body.prompt && req.body.tool) {
                    const result = await (0, data_1.storeConfiguration)(req.body);
                    if (!result) {
                        return res.status(400).send({ message: "Configuration already exists" });
                    }
                    else {
                        return res.status(200).send({ message: "success" });
                    }
                }
                // Neither condition is met
                else {
                    return res.status(400).send({ message: "Mandatory fields are missing" });
                }
            });
            // chat = Converse with the llm. start is true, when the conversation is started
            app.post('/chat', async (req, res) => {
                if (req.body.name && req.body.start && req.body.message) {
                    const result = await chatRequest(req.body);
                    if (!result) {
                        return res.status(400).send({ message: "Configuration does not exist" });
                    }
                    else {
                        // In this case we need to get rivet going!
                        return res.status(200).send({ message: "success" });
                    }
                }
                else {
                    return res.status(400).send({ message: "Mandatory fields are missing" });
                }
            });
        };
        startServer();
    }
}
exports.serveApi = serveApi;
//# sourceMappingURL=api.js.map