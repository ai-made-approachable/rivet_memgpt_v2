"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.templates = void 0;
const battle_yaml_1 = __importDefault(require("../templates/battle.yaml"));
const closed_q_a_yaml_1 = __importDefault(require("../templates/closed_q_a.yaml"));
const factuality_yaml_1 = __importDefault(require("../templates/factuality.yaml"));
const humor_yaml_1 = __importDefault(require("../templates/humor.yaml"));
const possible_yaml_1 = __importDefault(require("../templates/possible.yaml"));
const security_yaml_1 = __importDefault(require("../templates/security.yaml"));
const sql_yaml_1 = __importDefault(require("../templates/sql.yaml"));
const summary_yaml_1 = __importDefault(require("../templates/summary.yaml"));
const translation_yaml_1 = __importDefault(require("../templates/translation.yaml"));
exports.templates = {
    battle: battle_yaml_1.default,
    closed_q_a: closed_q_a_yaml_1.default,
    factuality: factuality_yaml_1.default,
    humor: humor_yaml_1.default,
    possible: possible_yaml_1.default,
    security: security_yaml_1.default,
    sql: sql_yaml_1.default,
    summary: summary_yaml_1.default,
    translation: translation_yaml_1.default,
};
