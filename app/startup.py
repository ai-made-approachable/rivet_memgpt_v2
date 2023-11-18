import gradio as gr
import requests
import json

def getOptions():
    response = requests.get(
        "http://localhost:8085/options",
        headers={"Content-Type": "application/json"},
    )
    return response.json().get("options")

def startup(configuration, name, human, persona, prompt, tool, gptmodel):
    data = {
        "configuration": configuration if configuration else None,
        "name": name if name else None,
        "human": human,
        "persona": persona,
        "prompt": prompt,
        "tool": tool,
        "gptmodel": gptmodel
    }
    json_data = json.dumps(data)
    response = requests.post(
        "http://localhost:8085/start",
        data=json_data,
        headers={"Content-Type": "application/json"},
    )
    #print(response.json())

    return True

choices = getOptions()

setup = gr.Interface(
    fn=startup,
    inputs=[
        gr.Dropdown(
            choices=choices.get("configurations") if choices.get("configurations") else "",
            value=choices.get("configurations")[0] if choices.get("configurations") else "",
            label="Configuration",
            info="If you already have a configuration you can select it here.",
            container=True,
            interactive=True if choices.get("configurations") else False,
        ),
        gr.Textbox(
            label="Configuration name",
            info="Enter the name for the new configuration"
        ),
        gr.Dropdown(
            choices=choices.get("humans"),
            value=choices.get("humans")[0],
            label="Human",
            info="Select the user information"
        ),
        gr.Dropdown(
            choices=choices.get("personas"),
            value=choices.get("personas")[0],
            label="Persona",
            info="Select the persona"
        ),
        gr.Dropdown(
            choices=choices.get("prompts"),
            value=choices.get("prompts")[0],
            label="Prompt",
            info="Select the system prompt"
        ),
        gr.Dropdown(
            choices=choices.get("tools"),
            value=choices.get("tools")[0],
            label="GPT Tools/Functions",
            info="Select the functions that shall be available"
        ),
        gr.Dropdown(
            choices=choices.get("gptmodels"),
            value=choices.get("gptmodels")[0],
            label="GPT Model",
            info="Select the gpt model to be used"
        ),
    ],
    title="MemGPT Startup",
    article="Either select an existing configuration or create a new configuration",
    outputs=None,
)

setup.launch()
