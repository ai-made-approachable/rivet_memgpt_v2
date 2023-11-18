"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveConfigurations = exports.storeConfiguration = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const openai_assistants_1 = require("./openai_assistants");
let dbPath = "./data/databases";
let filesPath = "./data";
/*
    Internal functions
*/
async function createDatabaseFile(name) {
    const dirPath = `${dbPath}/${name}`;
    const filePath = `${dirPath}/${name}.sql`;
    return new Promise((resolve, reject) => {
        fs_1.default.mkdir(dirPath, { recursive: true }, (err) => {
            if (err) {
                reject(err);
            }
            fs_1.default.writeFile(filePath, "", (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log(`File created at ${filePath}`);
                    resolve(filePath);
                }
            });
        });
    });
}
async function connectToDatabase(path) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3_1.default.Database(path, (err) => {
            if (err) {
                console.error('Could not connect to database', err);
                reject(err);
            }
            else {
                console.log('Connected to database');
                resolve(db);
            }
        });
    });
}
async function checkDatabaseFile(name) {
    const dirPath = `${dbPath}/${name}`;
    const filePath = `${dirPath}/${name}.sql`;
    if (fs_1.default.existsSync(filePath)) {
        //console.log("File exists")
        return true;
    }
    else {
        //console.log("File does not exists")
        return filePath;
    }
}
async function createTable(db) {
    const sql = `CREATE TABLE IF NOT EXISTS meta (human, persona, prompt, tool, gptmodel, thread, assistant)`;
    return new Promise((resolve, reject) => {
        db.run(sql, (err) => {
            if (err) {
                console.error('Could not create table', err);
                reject(err);
            }
            else {
                console.log('Table created');
                resolve(void 0);
            }
        });
    });
}
async function populateTable(db, data, ids) {
    const sql = `INSERT INTO meta (human, persona, prompt, tool, gptmodel, assistant, thread) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [data.human, data.persona, data.prompt, data.tool, data.gptmodel, ids["assistantId"], ids["threadId"]];
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                console.error('Could not insert data', err);
                reject(err);
            }
            else {
                console.log(`Data inserted`);
                resolve(this.lastID);
            }
        });
    });
}
async function returnData(db) {
    const sql = `SELECT * FROM meta`;
    db.get(sql, [], (err, row) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log(row);
        }
    });
}
async function retrieveFileData(data) {
    const files = [
        { name: 'human', folder: 'humans', file: data.human },
        { name: 'persona', folder: 'personas', file: data.persona },
        { name: 'prompt', folder: 'prompts', file: data.prompt },
        { name: 'tool', folder: 'tools', file: data.tool }
    ];
    const fileContent = {};
    files.forEach(({ name, folder, file }) => {
        const filePath = path_1.default.join(filesPath, folder, file);
        if (fs_1.default.existsSync(filePath)) {
            const fileData = fs_1.default.readFileSync(filePath, 'utf8');
            fileContent[name] = name === 'tool' ? JSON.parse(fileData) : fileData;
        }
        else {
            console.error(`File not found at ${filePath}`);
        }
    });
    return fileContent;
}
async function storeData(data) {
    // Create new database file and database entries
    const newPath = await createDatabaseFile(data.name);
    const db = await connectToDatabase(newPath);
    await createTable(db);
    // Retrieve content of the files before populating the database
    const content = await retrieveFileData(data);
    content["gptmodel"] = data.gptmodel;
    // Get thread id from rivet. Then extend variables passed to populateTable by thread id
    const ids = await (0, openai_assistants_1.createIds)(data.name, data.gptmodel);
    console.log(ids);
    await populateTable(db, content, ids);
    await returnData(db);
}
/*
    External functions
*/
async function storeConfiguration(data) {
    const filePath = await checkDatabaseFile(data.name);
    if (filePath === true) {
        // Don't overwrite database file and return error in API
        return false;
    }
    else {
        await storeData(data);
        return true;
    }
}
exports.storeConfiguration = storeConfiguration;
async function retrieveConfigurations() {
    const foldersPath = path_1.default.join(dbPath, "/");
    const folderNames = fs_1.default.readdirSync(foldersPath).filter((file) => {
        return fs_1.default.statSync(path_1.default.join(foldersPath, file)).isDirectory();
    });
    return folderNames;
}
exports.retrieveConfigurations = retrieveConfigurations;
//# sourceMappingURL=data.js.map