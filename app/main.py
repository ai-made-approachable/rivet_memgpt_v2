import gradio as gr
import requests
import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

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
        "name": name.lower() if name else None,
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
            value="gpt-4-1106-preview",
            label="GPT Model",
            info="Select the gpt model to be used",
        ),
    ],
    outputs=None
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

def get_chat_message(configuration, start, message="no message"):
    if(start):
        gr.Info("Starting the conversation. Please wait")
    data = {
        "name": configuration,
        "message": message,
        "start": start
    }
    json_data = json.dumps(data)
    print(json_data)
    response = requests.post(
        localhost + "/chat",
        data=json_data,
        headers={"Content-Type": "application/json"},
    )
    response = response.json()
    if response.get("status") == "success":
        bot_message = f""" 
            **Assistant** *({response.get("inner_monologue")})*
            {response.get("message")}
        """
        audio = getAudioPlayback(response.get("message"))
        voice = audio.content
        with open("voice.mp3", 'wb') as f:
            f.write(voice)
        return bot_message
    else:
        gr.Warning(response.get("status"))
        return None

def getAudioPlayback(message):
    response = client.audio.speech.create(
        model="tts-1",
        voice = "alloy",
        input = message
    )
    return response
    

# Chat interface
with gr.Blocks() as chat:
    chatbot = gr.Chatbot(height=600)
    with gr.Row():
        
        with gr.Column(scale=8):
            msg = gr.Textbox(interactive=False, value="Event: User logged in", scale=7)
            audio_input = gr.Audio(sources=["microphone"], label="Speak", type="filepath", interactive=False)
        with gr.Column(scale=2):
            chat_submit = gr.Button("Submit", interactive=False, scale=2)

    audio_playback = gr.Audio(format='mp3', interactive = False, container = True, value=None, label="AI response", autoplay=True)
    clear = gr.Button("Clear", interactive=False)

    # Chat message functions
    def user_first_message(user_message, history):
        return "", history + [[user_message, None]]

    def bot_first_message(history, configuration):
        bot_message = get_chat_message(configuration, True)
        history [-1][1] = bot_message
        return gr.Textbox(interactive=True), gr.Button("Clear", interactive=True), history, gr.Button("Submit", interactive=True, scale=2), "voice.mp3", gr.Audio(sources=["microphone"], label="Speak", type="filepath", interactive=True)

    def user_message(user_message, history):
        global current_message
        current_message = user_message
        return "", history + [[user_message, None]]
    
    def bot_message(history, configuration):
        bot_message = get_chat_message(configuration, False, current_message)
        history [-1][1] = bot_message
        return history, "voice.mp3"

    clear.click(lambda: None, None, chatbot, queue=False)

chat.queue()

def hideStartChatting():
    return gr.Dropdown(visible=False), gr.Button(visible=False)

def audioInputToTextbox(audio_input):
    audio_file = open(audio_input, "rb")
    transcript = client.audio.transcriptions.create(model="whisper-1", file=audio_file)
    return gr.Textbox(value=transcript.text)

# Combined interface
with gr.Blocks(title="Rivet-MemGPT", css="footer{display:none !important}") as combined:
    gr.Markdown(
        """# Welcome to Rivet-MemGPT"""
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
    configuration_submit.click(
        user_first_message, [msg, chatbot], [msg, chatbot], queue=False
            ).then(hideStartChatting, [], [configuration_dropdown, configuration_submit]
            ).then(bot_first_message, [chatbot, configuration_dropdown], [msg, clear, chatbot, chat_submit, audio_playback, audio_input])
    
    # Continue chat on "submit" in either way
    gr.on(
        triggers=[msg.submit, chat_submit.click],
        fn=user_message, 
        inputs=[msg, chatbot], 
        outputs=[msg, chatbot], 
        queue=False
    ).then(
        bot_message, [chatbot, configuration_dropdown], [chatbot, audio_playback]
    )

    #Continue chat after audio input has been made
    audio_input.change(fn=audioInputToTextbox, inputs=[audio_input], outputs=[msg]
        ).then(lambda :None, None, audio_input
        ).then(user_message, [msg, chatbot], [msg, chatbot], queue=False
        ).then(bot_message, [chatbot, configuration_dropdown], [chatbot, audio_playback])

    #msg.submit(user_message, [msg, chatbot], [msg, chatbot], queue=False).then(
    #    bot_message, [chatbot, configuration_dropdown], chatbot
    #)                          

# Launch interfaces
combined.launch(inbrowser=False, show_api=False)
