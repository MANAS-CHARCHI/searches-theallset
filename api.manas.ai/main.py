from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from callGemini import call_gemini, chat
from helper import write_email, format_email_for_user, write_search_chat_response # assuming this saves or sends email

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # allow all headers
)

# Request model
class EmailRequest(BaseModel):
    sender: str
    receiver: str
    context: str
    save_email: bool = False

# API endpoint


@app.post("/generate_email")
def generate_content(request: EmailRequest):
    try:
        email_text = write_email(
            sender=request.sender,
            receiver=request.receiver,
            context=request.context,
        )
        
        response_text = call_gemini(email_text)
        return {"generated_email": response_text}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ChatRequest(BaseModel):
    previous_context: str
    latest_message: str

@app.post("/search")
def search_chat(request: ChatRequest):
    try:
        # You can prepend context if provided
        prompt = write_search_chat_response(request.previous_context, request.latest_message)
        ai_response = chat(prompt)
        return {"ai_response": ai_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))