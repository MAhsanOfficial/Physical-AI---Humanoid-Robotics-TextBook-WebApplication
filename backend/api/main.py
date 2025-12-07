import os
import uuid
import json
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from backend.rag.rag_pipeline import RAGPipeline
from dotenv import load_dotenv, find_dotenv

# Load environment variables
load_dotenv("chatbot_config.env")
load_dotenv(find_dotenv())

app = FastAPI(
    title="Physical AI Book RAG Backend",
    description="API for ingesting book content and querying it using RAG.",
    version="1.0.0",
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Authentication ---
USERS_FILE = os.path.join(os.path.dirname(__file__), "..", "db", "users.json")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class User(BaseModel):
    name: str
    email: str
    phone: str
    experience: str
    hashed_password: str

class UserCreate(BaseModel):
    name: str
    email: str
    phone: str
    experience: str
    password: str

def read_users() -> List[Dict]:
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def write_users(users: List[Dict]):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

def get_user(email: str):
    users = read_users()
    for user in users:
        if user["email"] == email:
            return user
    return None

@app.post("/signup", status_code=201)
async def signup(user_data: UserCreate):
    users = read_users()
    if get_user(user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user_data.password)
    new_user = {
        "name": user_data.name,
        "email": user_data.email,
        "phone": user_data.phone,
        "experience": user_data.experience,
        "hashed_password": hashed_password,
    }
    users.append(new_user)
    write_users(users)
    return {"message": "User created successfully"}

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(form_data.username)
    if not user or not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # In a real app, you'd return a JWT token here.
    # For this task, we'll just return the user's name.
    return {"access_token": user["name"], "token_type": "bearer"}


# --- RAG Pipeline ---
try:
    rag_pipeline = RAGPipeline()
except ValueError as e:
    print(f"Failed to initialize RAGPipeline: {e}")
    rag_pipeline = None

def get_rag_pipeline():
    if not rag_pipeline:
        raise HTTPException(status_code=503, detail="RAG Pipeline is not initialized. Check server logs for configuration errors (missing API keys).")
    return rag_pipeline

chat_sessions: Dict[str, List[Dict[str, str]]] = {}

class QueryRequest(BaseModel):
    query: str
    limit: int = 5

class QuerySelectedRequest(BaseModel):
    query: str
    selected_passage: str

@app.post("/embed-book")
async def embed_book():
    try:
        pipeline = get_rag_pipeline()
        pipeline.ingest_documents()
        return {"message": "Book content successfully embedded and stored in Qdrant."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to embed book content: {e}")

@app.post("/query")
async def query_book(request: QueryRequest):
    try:
        pipeline = get_rag_pipeline()
        answer = pipeline.query(request.query, limit=request.limit)
        return {"query": request.query, "answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query book: {e}")

@app.post("/query-selected")
async def query_selected_passage(request: QuerySelectedRequest):
    try:
        pipeline = get_rag_pipeline()
        answer = pipeline.query(
            request.query,
            selected_passage_content=request.selected_passage
        )
        return {"query": request.query, "selected_passage": request.selected_passage, "answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query selected passage: {e}")

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class TranslateRequest(BaseModel):
    text: str
    target_language: str = "Urdu"

@app.post("/translate")
async def translate_text(request: TranslateRequest):
    try:
        pipeline = get_rag_pipeline()
        translation = pipeline.translate(request.text, request.target_language)
        return {"original_text": request.text, "translated_text": translation, "target_language": request.target_language}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to translate text: {e}")

@app.post("/chat")
async def chat_with_book(request: ChatRequest):
    try:
        pipeline = get_rag_pipeline()
        session_id = request.session_id
        if not session_id:
            session_id = str(uuid.uuid4())
            chat_sessions[session_id] = []

        history = chat_sessions.get(session_id, [])
        history.append({"role": "user", "content": request.message})
        chat_sessions[session_id] = history

        response_content = pipeline.chat(request.message, history)

        history.append({"role": "assistant", "content": response_content})
        chat_sessions[session_id] = history

        return {"session_id": session_id, "response": response_content}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to process chat message: {e}")

@app.get("/")
async def root():
    return {"message": "Physical AI Book RAG Backend is running."}


