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
    # Lightweight startup: Heavy ML models (Embeddings, Chroma) 
    # are now lazy-loaded on the first /chat request to prevent OOM errors on Render Free Tier.
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
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://mission-archive-portfolio.vercel.app"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
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
        result = get_answer(request.message)
        return ChatResponse(
            response=result.get("answer", result.get("response", "")), 
            sources=result.get("sources", []),
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
