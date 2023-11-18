import express from "express";
import fs from "fs";
import util from "util";

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

async function generateOptions() {
    const directoryPath = './data'
    const folders = ["humans", "personas", "prompts", "tools"]
    const config = {}

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

export class serveApi {
    constructor() {
        const startServer = async () => {
            const options = await generateOptions();
            const app = express();
            app.use(express.json());
            const PORT = 8085;

            app.listen(
                PORT,
                () => console.log('Listening on http://localhost:' + PORT)
            )

            app.get('/options', async (req, res) => {
                return res.status(200).send({ options });
            })

            app.post('/start', async (req, res) => {
                console.log(req.body);
                return res.status(200).send({ message: "success" })
            })
        };
        startServer();
    }
}

