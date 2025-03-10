from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import asyncio
import os
from dotenv import load_dotenv
import httpx

# Load environment variables
load_dotenv()

app = FastAPI(title="MuxChat API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str
    id: Optional[str] = None

class ChatRequest(BaseModel):
    messages: List[Message]
    model: str = "auto"

# OpenAI API configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

async def stream_openai_response(messages, client):
    """Stream response from OpenAI API"""
    formatted_messages = [{"role": msg.role, "content": msg.content} for msg in messages]
    
    response = await client.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "gpt-4o",
            "messages": formatted_messages,
            "stream": True
        },
        timeout=60.0
    )
    
    async for line in response.aiter_lines():
        if line.startswith("data: "):
            line = line[6:]
            if line.strip() == "[DONE]":
                break
            try:
                chunk = json.loads(line)
                if chunk.get("choices") and chunk["choices"][0].get("delta") and chunk["choices"][0]["delta"].get("content"):
                    content = chunk["choices"][0]["delta"]["content"]
                    yield f"data: {json.dumps({'type': 'text', 'text': content})}\n\n"
            except json.JSONDecodeError:
                continue

# For demo purposes, we'll use OpenAI for all models
# In a real implementation, you would add similar functions for Anthropic and Google

@app.post("/chat")
async def chat(request: ChatRequest):
    """Chat endpoint that streams responses from the selected model"""
    async def stream_response():
        async with httpx.AsyncClient() as client:
            # Select the appropriate model based on the request
            if request.model == "auto" or request.model == "gpt-4o":
                async for chunk in stream_openai_response(request.messages, client):
                    yield chunk
            elif request.model == "claude-3-5-sonnet":
                # In a real implementation, you would use the Anthropic API
                # For demo, we'll use OpenAI
                async for chunk in stream_openai_response(request.messages, client):
                    yield chunk
            elif request.model == "gemini-pro":
                # In a real implementation, you would use the Google API
                # For demo, we'll use OpenAI
                async for chunk in stream_openai_response(request.messages, client):
                    yield chunk
            else:
                # Default to OpenAI
                async for chunk in stream_openai_response(request.messages, client):
                    yield chunk
                    
        # End the stream
        yield f"data: [DONE]\n\n"

    return StreamingResponse(
        stream_response(),
        media_type="text/event-stream"
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

