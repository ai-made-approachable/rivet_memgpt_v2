"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveApi = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
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
    config["configurations"] = [];
    return config;
}
class serveApi {
    constructor() {
        const startServer = async () => {
            const options = await generateOptions();
            const app = (0, express_1.default)();
            app.use(express_1.default.json());
            const PORT = 8085;
            app.listen(PORT, () => console.log('Listening on http://localhost:' + PORT));
            app.get('/options', async (req, res) => {
                return res.status(200).send({ options });
            });
            app.post('/start', async (req, res) => {
                console.log(req.body);
                return res.status(200).send({ message: "success" });
            });
        };
        startServer();
    }
}
exports.serveApi = serveApi;
//# sourceMappingURL=api.js.map