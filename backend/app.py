from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from typing import List, Optional
from contextlib import asynccontextmanager

from query import get_answer
from ingest import ingest_documents
from query import CHROMA_DB_DIR

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Pre-loading HuggingFace embedding models and vectorstore...")
    
    # Auto-ingest if DB is missing (crucial for Render deployment)
    if not os.path.exists(CHROMA_DB_DIR) or not os.listdir(CHROMA_DB_DIR):
        print("chroma_db not found. Running automatic ingestion for deployment...")
        ingest_documents()
        
    from query import get_vectorstore
    get_vectorstore()
    print("Models pre-loaded successfully. System ready.")
    yield

# Initialize FastAPI application
app = FastAPI(
    title="Portfolio Chatbot API",
    description="API for the portfolio's AI chatbot using Groq and ChromaDB",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with exact frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]
    tech_wiki: Optional[str] = None
    suggestions: Optional[List[str]] = None

@app.get("/")
def root():
    """Root endpoint for API verification."""
    return {"message": "Mission Archive AI Assistant API is running"}

@app.get("/health")
def health_check():
    """Health check endpoint to ensure API is responsive."""
    return {"status": "ok", "message": "Backend is running smoothly."}

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Main chat endpoint. Queries the vector DB and returns an AI answer + source chunks.
    """
    try:
        result = get_answer(request.query)
        return ChatResponse(
            answer=result["answer"], 
            sources=result["sources"],
            tech_wiki=result.get("tech_wiki"),
            suggestions=result.get("suggestions")
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Error processing chat request: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@app.post("/reingest")
def reingest():
    """
    Endpoint to trigger reingestion of PDFs in the data folder.
    """
    try:
        success = ingest_documents()
        if success:
            return {"status": "success", "message": "Documents ingested successfully."}
        else:
            raise HTTPException(status_code=404, detail="No documents found to ingest.")
    except Exception as e:
        print(f"Error during ingestion: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred during ingestion.")
