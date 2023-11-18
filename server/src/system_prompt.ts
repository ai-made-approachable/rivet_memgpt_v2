import fs from 'fs';

async function getMemoryInfo(constants) {
    // In the future this actually needs to do something... replace all the values etc.
    return false
}

export async function createSystemPrompt(data) {
    const constants = JSON.parse(fs.readFileSync('./data/constants.json', 'utf8'));
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

