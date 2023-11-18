import gradio as gr
import requests
import json
import random
import time

localhost = "http://localhost:8085"

# Setup interface
def getOptions():
    response = requests.get(
        localhost + "/options",
        headers={"Content-Type": "application/json"},
    )
    return response.json().get("options")

def startup(name, human, persona, prompt, tool, gptmodel):
    data = {
        "name": name if name else None,
        "human": human,
        "persona": persona,
        "prompt": prompt,
        "tool": tool,
        "gptmodel": gptmodel,
    }
    json_data = json.dumps(data)
    response = requests.post(
        localhost + "/save",
        data=json_data,
        headers={"Content-Type": "application/json"},
    )
    response = response.json()
    if response.get("message") == "success":
        gr.Info("Succesfully created the new configuration")
        return True
    else:
        gr.Warning(response.get("message"))
        return False

choices = getOptions()

setup = gr.Interface(
    fn=startup,
    inputs=[
        gr.Textbox(
            label="Configuration name",
            info="Enter the name for the new configuration (do not use special characters)",
        ),
        gr.Dropdown(
            choices=choices.get("humans"),
            value=choices.get("humans")[0],
            label="Human",
            info="Select the user information",
        ),
        gr.Dropdown(
            choices=choices.get("personas"),
            value=choices.get("personas")[0],
            label="Persona",
            info="Select the persona",
        ),
        gr.Dropdown(
            choices=choices.get("prompts"),
            value=choices.get("prompts")[0],
            label="Prompt",
            info="Select the system prompt",
        ),
        gr.Dropdown(
            choices=choices.get("tools"),
            value=choices.get("tools")[0],
            label="GPT Tools/Functions",
            info="Select the functions that shall be available",
        ),
        gr.Dropdown(
            choices=choices.get("gptmodels"),
            value=choices.get("gptmodels")[0],
            label="GPT Model",
            info="Select the gpt model to be used",
        ),
    ],
    outputs=None,
)
# Start chatting
def update_dropdown_choices():
    response = requests.get(
        localhost + "/configs",
        headers={"Content-Type": "application/json"},
    )
    choices = response.json().get("configs")
    return gr.Dropdown(
            choices=choices, 
            value=choices[0], 
            label="Select configuration", 
            info="If no configuration is visible, create a new configuration first",
            interactive=True
        )

def start_chat(configuration):
    print(configuration)
    data = {
        "name": configuration,
        "message": "let's go",
        "start": True
    }
    json_data = json.dumps(data)
    response = requests.post(
        localhost + "/chat",
        data=json_data,
        headers={"Content-Type": "application/json"},
    )
    response = response.json()
    if response.get("message") == "success":
        gr.Info("Succesfully started the conversation. Please wait")
        return gr.Textbox(interactive=True), gr.Button("Clear", interactive=True)
    else:
        gr.Warning(response.get("message"))
        return False

# Chat interface
with gr.Blocks() as chat:
    chatbot = gr.Chatbot()
    msg = gr.Textbox(interactive=False)
    clear = gr.Button("Clear", interactive=False)

    def user(user_message, history):
        return "", history + [[user_message, None]]

    def bot(history):
        bot_message = random.choice(["How are you?", "I love you", "I'm very hungry"])
        time.sleep(2)
        history[-1][1] = bot_message
        return history

    msg.submit(user, [msg, chatbot], [msg, chatbot], queue=False).then(
        bot, chatbot, chatbot
    )
    clear.click(lambda: None, None, chatbot, queue=False)

# Combined interface
with gr.Blocks(title="Rivet-MemGPT") as combined:
    gr.Markdown(
        """
                # Welcome to Rivet-MemGPT
                > Create a new configuration or continue with an existing one in "Start chatting"
                """
    )
    with gr.Tab("Create new configuration"):
        setup.render()
    with gr.Tab("Start chatting") as testTab:
        with gr.Row():
            configuration_dropdown = gr.Dropdown(scale=7)
            configuration_submit = gr.Button("Start conversation", scale=3)
        chat.render()

    # Events
    testTab.select(fn=update_dropdown_choices, inputs=None, outputs=[configuration_dropdown])
    configuration_submit.click(fn=start_chat, inputs=[configuration_dropdown], outputs=[msg, clear])

chat.queue()

# Launch interfaces
combined.launch(inbrowser=True, show_api=False)
