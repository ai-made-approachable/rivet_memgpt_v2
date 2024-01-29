# About This Project
This project is a rough reconstruction of the core functions of the MemGPT project, expanded with the following contents:
- Chat interface with voice input and output
- Use of the OpenAI Assistants API (enables, among other things, automatic management of chat history)

Note: The project name is misleading by now. It was planned to include parts in Rivet (a visual programming tool), but in the end it was done fully in code.

## Technical Overview
- Node.js/TypeScript backend (/server/src/) manages all communication with the OpenAI API and provides an express API interface
- Python frontend (gradio) for the chat interface and voice input and output
- sqlite database for relational data
- llamaindex for the vector database

## Installation
- git clone https://github.com/ai-made-approachable/memgpt_prototyp.git
- pip install -r requirements.txt in /app/
- npm install in /server/
- Make OPENAI_API_KEY available in the environment

### Visual Code Example
#### launch.json
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Backend",
            "preLaunchTask": "build",
            "skipFiles": [
                "<node_internals>/server/**"
            ],
            "program": "${workspaceFolder}/server/src/main.ts",
            "outFiles": [
                "${workspaceFolder}/server/**/*.js"
            ],
            "env": {
                "OPENAI_API_KEY": "YOUR KEY"
            }
        },
        {
            "type": "python",
            "request": "launch",
            "name": "Launch Frontend",
            "program": "${workspaceFolder}/app/main.py",
            "env": {
                "OPENAI_API_KEY": "YOUR KEY"
            }
        }
    ],
    "compounds": [
        {
            "name": "Launch Both",
            "configurations": ["Launch Backend", "Launch Frontend"]
        }
    ]
}

#### tasks.json

{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "build",
      "type": "shell",
      "command": "npm run build",
      "options": {
        "cwd": "${workspaceFolder}/server"
      }
    }
  ]
}
```
