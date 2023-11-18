"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSystemPrompt = void 0;
const fs_1 = __importDefault(require("fs"));
async function getMemoryInfo(constants) {
    // In the future this actually needs to do something... replace all the values etc.
    return false;
}
async function createSystemPrompt(data) {
    const constants = JSON.parse(fs_1.default.readFileSync('./data/constants.json', 'utf8'));
    const memoryInfo = await getMemoryInfo(constants);
    let systemPrompt = `
        ${data.prompt}
        ${memoryInfo ? `\n${memoryInfo}\n` : ""}
        ${constants.coreMemoryInfo}

        <persona>
        ${data.persona}
        </persona>

        <human>
        ${data.human}
        </human>

        ${constants.instructionsEnd}
    `;
    // Get rid of the whitespaces because of indentation
    systemPrompt = systemPrompt.split('\n').map(line => line.trim()).join('\n');
    return systemPrompt;
}
exports.createSystemPrompt = createSystemPrompt;
//# sourceMappingURL=system_prompt.js.map