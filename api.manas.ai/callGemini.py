import os
import requests
from dotenv import load_dotenv
from langchain.schema import HumanMessage, AIMessage
from langchain_community.chat_message_histories import ChatMessageHistory

# Load environment variables from a .env file
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Use the specific URL you want
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
def parse_response(response: dict) -> str:
    """Parses the JSON response from the Gemini API and returns the text."""
    try:
        if response['status']!=200:
            return "Could not retrieve text from the response."
        return response['data']['candidates'][0]['content']['parts'][0]['text']
    except (KeyError, IndexError) as e:
        print(f"Error parsing response: {e}")
        return "Could not retrieve text from the response."

def call_gemini(prompt: str) -> dict:
    """
    Sends a request to the Gemini API with the given prompt and URL.
    Args:
        prompt (str): The text prompt to send to the model.
    Returns:
        dict: The JSON response from the API.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is missing in .env")

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GEMINI_API_KEY
    }

    # Corrected payload structure with generationConfig
    payload = {
        "contents": [
            {"parts": [{"text": prompt}]}
        ],
        "generationConfig": {
            "temperature": 0.9,
            "candidate_count": 1
        }
    }
    response_data = {} 

    try:
        response = requests.post(GEMINI_API_URL, json=payload, headers=headers)
        api_data = response.json()
        response_data['status'] = response.status_code
        response_data['data'] = api_data 
        # response.raise_for_status()
    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")
        print(f"Response content: {response.text}")
        return {}
    except requests.exceptions.RequestException as err:
        print(f"An error occurred: {err}")
        return {}

    return parse_response(response_data)

chat_history = ChatMessageHistory()
MAX_HISTORY = 10  # keep last 10 messages

def add_message_limited(msg):
    chat_history.add_message(msg)
    # Trim history if it exceeds MAX_HISTORY
    if len(chat_history.messages) > MAX_HISTORY:
        chat_history.messages = chat_history.messages[-MAX_HISTORY:]

def call_gemini_with_history(prompt: str) -> str:
    """Call Gemini API with chat history context and return response text."""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is missing in .env")

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GEMINI_API_KEY
    }

    # Convert chat history + new user prompt into Gemini's expected format
    contents = []
    for msg in chat_history.messages:
        role = "user" if msg.type == "human" else "model"
        contents.append({"role": role, "parts": [{"text": msg.content}]})

    # Add the latest user input
    contents.append({"role": "user", "parts": [{"text": prompt}]})

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.9,
            "candidate_count": 1
        }
    }
    try:
        response = requests.post(GEMINI_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()

        return data["candidates"][0]["content"]["parts"][0]["text"]

    except Exception as e:
        print(f"Error: {e}")
        return "⚠️ Could not get response."


def chat(prompt: str):
    """Save user & AI messages into LangChain chat history."""
    # Save user message
    chat_history.add_message(HumanMessage(content=prompt))

    # Get AI response
    ai_response = call_gemini_with_history(prompt)

    # Save messages
    add_message_limited(HumanMessage(content=prompt))

    return ai_response

# if __name__ == "__main__":
#     response = call_gemini("tell me political joke")
#     print(response)

if __name__ == "__main__":
    while True:
        user_input = input(" ")
        if user_input.lower() in {"quit", "exit"}:
            break
        response = chat(user_input)
        print(f"AI: {response}\n")

    print("\nChat history:")
    for msg in chat_history.messages:
        print(f"{msg.type}: {msg.content}")