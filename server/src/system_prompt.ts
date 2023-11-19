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

export async function createLoginMessage(lastLogin) {
    const now = new Date();
    let message = "";
    if (lastLogin == null) {
        message = "User logged in for the first time";
    } else {
        const lastLoginDate = new Date(lastLogin);
        const diff = now.getTime() - lastLoginDate.getTime();
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        message = `User returned after ${diffDays} days, ${diffHours} hours, and ${diffMinutes} minutes`;
    }
    const loginMessage = {
        "event": "login",
        "message": message,
        "last_login": lastLogin,
        "current_time": now
    };
    return loginMessage;
}

