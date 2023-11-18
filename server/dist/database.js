"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
let sql;
// connect to DB
const db = new sqlite3_1.default.Database("./database/test.db", sqlite3_1.default.OPEN_READWRITE, (err) => {
    if (err)
        return console.error(err.message);
});
// Create table
sql = `CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, first_name)`;
db.run(sql);
// Insert data
sql = `INSERT INTO users(first_name) VALUES (?)`;
db.run(sql, ["Tim"], (err) => {
    if (err)
        return console.error(err.message);
});
// Update data
sql = `UPDATE Users SET first_name = ? WHERE id = ?`;
db.run(sql, ["Tom", 1], (err) => {
    if (err)
        return console.error(err.message);
});
// Get data
sql = `SELECT * FROM users`;
const result = db.all(sql, [], (err, rows) => {
    if (err)
        return console.error(err.message);
    rows.forEach(row => {
        console.log(row);
    });
});
//# sourceMappingURL=database.js.map