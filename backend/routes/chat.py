from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from services.ollama import chat_stream, get_models
from store import get_file

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str
    messages: List[Message]
    file_ids: Optional[List[str]] = []

@router.get("/models")
async def list_models():
    models = get_models()
    return {"models": models}

@router.post("/chat")
async def chat(request: ChatRequest):
    if not request.messages:
        raise HTTPException(status_code=400, detail="Messages array cannot be empty")
        
    messages_dicts = [{"role": msg.role, "content": msg.content} for msg in request.messages]
    
    # Inject file context if provided
    if request.file_ids:
        context_texts = []
        for file_id in request.file_ids:
            text = get_file(file_id)
            if text:
                context_texts.append(text)
                
        if context_texts:
            combined_context = "\n\n---\n\n".join(context_texts)
            
            # Find the last user message to inject context
            for msg in reversed(messages_dicts):
                if msg["role"] == "user":
                    original_input = msg["content"]
                    
                    structured_prompt = f"""SYSTEM:
You are a helpful AI assistant.

USER:
{original_input}

CONTEXT:
{combined_context}"""

                    msg["content"] = structured_prompt
                    break
                    
    def generate():
        for chunk in chat_stream(request.model, messages_dicts):
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain")
