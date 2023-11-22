import sqlite3 from "sqlite3"
import fs from "fs"
import path from "path"
import { createIds } from "./openai_assistants.js";
import { get } from "http";

let dbPath = "./data/databases";
let filesPath = "./data"

/*
    Internal functions
*/
async function createDatabaseFile(name) {
    const dirPath = `${dbPath}/${name}`;
    const filePath = `${dirPath}/${name}.sql`;

    return new Promise((resolve, reject) => {
        fs.mkdir(dirPath, { recursive: true }, (err) => {
            if (err) {
                reject(err);
            }

            fs.writeFile(filePath, "", (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`File created at ${filePath}`);
                    resolve(filePath);
                }
            });
        });
    });
}

async function connectToDatabase(path) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(path, (err) => {
            if (err) {
                console.error('Could not connect to database', err);
                reject(err);
            } else {
                console.log('Connected to database');
                resolve(db);
            }
        });
    });
}

async function checkDatabaseFile(name) {
    const dirPath = `${dbPath}/${name}`;
    const filePath = `${dirPath}/${name}.sql`
    if (fs.existsSync(filePath)) {
        //console.log("File exists")
        return true;
    } else {
        //console.log("File does not exists")
        return filePath;
    }
}

async function createMetaTable(db) {
    const sql = `CREATE TABLE IF NOT EXISTS meta (human, persona, prompt, tool, gptmodel, thread, assistant)`;

    return new Promise<void>((resolve, reject) => {
        db.run(sql, (err) => {
            if (err) {
                console.error('Could not create table', err);
                reject(err);
            } else {
                console.log('Table created');
                resolve(void 0);
            }
        });
    });
}

async function populateTable(db, data, ids) {
    const sql = `INSERT INTO meta (human, persona, prompt, tool, gptmodel, assistant, thread) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [data.human, data.persona, data.prompt, JSON.stringify(data.tool), data.gptmodel, ids["assistantId"], ids["threadId"]];

    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                console.error('Could not insert data', err);
                reject(err);
            } else {
                console.log(`Data inserted`);
                resolve(this.lastID);
            }
        });
    });
}

async function returnData(db) {
    const sql = `SELECT * FROM meta`;
    return new Promise((resolve, reject) => {
        db.get(sql, [], (err, row) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(row); // Resolve with the row data
            }
        });
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
        const filePath = path.join(filesPath, folder, file);
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            fileContent[name] = name === 'tool' ? JSON.parse(fileData) : fileData;
        } else {
            console.error(`File not found at ${filePath}`);
        }
    });
    return fileContent;
}

async function storeData(data) {
    // Create new database file and database entries
    const newPath = await createDatabaseFile(data.name)
    const db = await connectToDatabase(newPath)
    await createMetaTable(db)
    // Retrieve content of the files before populating the database
    const content = await retrieveFileData(data)
    content["gptmodel"] = data.gptmodel
    // Get thread id from rivet. Then extend variables passed to populateTable by thread id
    const ids = await createIds(data.name, data.gptmodel)
    console.log(ids)
    await populateTable(db, content, ids)
    await returnData(db)
}

async function getDatabaseConnection(name) {
    const dirPath = `${dbPath}/${name}`;
    const filePath = `${dirPath}/${name}.sql`;
    const db = await connectToDatabase(filePath);
    return db;
}

async function createRecallMemoryTable(db) {
    const sql_create = `CREATE TABLE IF NOT EXISTS recall_memory (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT, message TEXT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
    await new Promise((resolve, reject) => {
        db.run(sql_create, (err) => {
            if (err) {
                console.error('Could not create table', err);
                reject(err);
            } else {
                resolve(void 0);
            }
        });
    });

}

async function createLoginTable(db) {
    const sql_create = `CREATE TABLE IF NOT EXISTS login (id INTEGER PRIMARY KEY AUTOINCREMENT, lastLogin TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
    await new Promise((resolve, reject) => {
        db.run(sql_create, (err) => {
            if (err) {
                console.error('Could not create table', err);
                reject(err);
            } else {
                resolve(void 0);
            }
        });
    });

    const sql_insert = `Insert into login (lastLogin) values (CURRENT_TIMESTAMP)`;
    await new Promise((resolve, reject) => {
        db.run(sql_insert, (err) => {
            if (err) {
                console.error('Could not insert data', err);
                reject(err);
            } else {
                resolve(void 0);
            }
        });
    });
}

async function getLastLogin(db) {
    const checkTableSql = `SELECT name FROM sqlite_master WHERE type='table' AND name='login';`;
    return new Promise((resolve, reject) => {
        db.get(checkTableSql, [], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(null);
            } else {
                const sql = `SELECT lastLogin FROM login ORDER BY id DESC LIMIT 1`;
                db.get(sql, [], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (row === undefined) {
                        resolve(null);
                    } else {
                        resolve(row.lastLogin);
                    }
                });
            }
        });
    });
}

function formatSQLiteDate(isoDateStr: string): string {
    const date = new Date(isoDateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/*
    External functions
*/

export async function updateRecallMemory(role, message, db) {
    await createRecallMemoryTable(db)
    const sql_insert = `INSERT INTO recall_memory (role, message) VALUES (?, ?)`;
    const params = [role, message];
    db.run(sql_insert, params, function (err) {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`Added ${role} message to recall_memory`);
        }
    })
}

export async function recallMemorySearchDate(functionArguments, db) {
    // Has no pagination yet! And no limitation to how many results are returned!
    const sql_select = `SELECT * FROM recall_memory WHERE timestamp BETWEEN ? AND ?`;
    // Fix timezone issues
    const startDate = formatSQLiteDate(new Date(functionArguments.start_date).toISOString());
    const endDate = formatSQLiteDate(new Date(functionArguments.end_date).toISOString());
    const params = [startDate, endDate];
    return new Promise((resolve, reject) => {
        db.all(sql_select, params, (err, rows) => {
            if (err) {
                console.error(err.message);
                reject({success: false, result: `Could not find any messages between ${functionArguments.start_date} and ${functionArguments.end_date}`});
            } else {
                const resultObject = rows.map(row => {
                    return {
                        role: row.role,
                        message: row.message,
                        timestamp: row.timestamp
                    }
                })
                resolve({ success: true, result: JSON.stringify(resultObject) });
            }
        });
    });

}


export function updateCoreMemory(operation, functionArguments, db): Promise<boolean> {
    const object = functionArguments.name
    const sql_select = `SELECT ${object} FROM meta`;

    return new Promise((resolve, reject) => {
        db.get(sql_select, [], (err, row) => {
            if (err) {
                console.error(err.message);
                reject(false);
            } else {
                let content = row[object]
                if (operation === "append") {
                    content += `\n${functionArguments.content}`
                } else if (operation === "replace") {
                    content = content.replace(functionArguments.old_content, functionArguments.new_content)
                }
                const sql_update = `UPDATE meta SET ${object} = ?`;
                db.run(sql_update, [content], function (err) {
                    if (err) {
                        console.error(err.message);
                        reject(false);
                    } else {
                        console.log(`Row(s) updated: ${this.changes}`);
                        resolve(true);
                    }
                });
            }
        })
    });
}

export async function storeConfiguration(data) {
    const filePath = await checkDatabaseFile(data.name);
    if (filePath === true) {
        // Don't overwrite database file and return error in API
        return false;
    } else {
        await storeData(data)
        return true;
    }
}

export async function retrieveConfigurations() {
    const foldersPath = path.join(dbPath, "/");
    const folderNames = fs.readdirSync(foldersPath).filter((file) => {
        return fs.statSync(path.join(foldersPath, file)).isDirectory();
    });
    return folderNames;
}

export async function retrieveData(name) {
    const db = await getDatabaseConnection(name)
    const data = await returnData(db); // Await the data from returnData
    return { data, db }
}

export async function storeLogin(name) {
    const db = await getDatabaseConnection(name)
    const lastLogin = await getLastLogin(db)
    if (!lastLogin) {
        await createLoginTable(db)
        return null
    } else {
        return lastLogin
    }
}