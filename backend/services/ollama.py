import json
import requests
from typing import List, Dict, Any, Generator

OLLAMA_URL = "http://localhost:11434"
TIMEOUT_SECONDS = 60

def get_models() -> List[str]:
    try:
        response = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
        response.raise_for_status()
        data = response.json()
        return [model["name"] for model in data.get("models", [])]
    except Exception as e:
        print(f"Error fetching models from Ollama: {e}")
        return []

def chat_stream(model: str, messages: List[Dict[str, str]]) -> Generator[str, None, None]:
    payload = {
        "model": model,
        "messages": messages,
        "stream": True
    }
    
    try:
        with requests.post(f"{OLLAMA_URL}/api/chat", json=payload, stream=True, timeout=TIMEOUT_SECONDS) as response:
            response.raise_for_status()
            for line in response.iter_lines():
                if line:
                    try:
                        chunk = json.loads(line.decode('utf-8'))
                        if "message" in chunk and "content" in chunk["message"]:
                            yield chunk["message"]["content"]
                    except json.JSONDecodeError:
                        print(f"Malformed chunk from Ollama: {line}")
                        continue
    except requests.exceptions.RequestException as e:
        print(f"Ollama connection error: {e}")
        yield f"\n\n**Error:** Could not connect to Ollama. Details: {str(e)}"
    except Exception as e:
        print(f"Unexpected error in chat_stream: {e}")
        yield f"\n\n**Error:** Unexpected error occurred: {str(e)}"
