import os
# pyrefly: ignore [missing-import]
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHROMA_DB_DIR = os.path.join(BASE_DIR, "chroma_db")

# Initialize expensive models globally so they don't reload on every request
_embeddings = None
_vectorstore = None
_tech_cache = {}

def get_vectorstore():
    global _embeddings, _vectorstore
    if _vectorstore is None:
        if not os.path.exists(CHROMA_DB_DIR) or not os.listdir(CHROMA_DB_DIR):
            return None
            
        print("Lazy-loading HuggingFace embeddings and Chroma DB to save memory...")
        # Lazy import heavy ML libraries ONLY when needed
        from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
        from langchain_community.vectorstores import Chroma
        
        # Initialize with FastEmbed (ONNX) explicitly to save memory (no PyTorch required)
        _embeddings = FastEmbedEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            max_length=512
        )
        _vectorstore = Chroma(
            persist_directory=CHROMA_DB_DIR, 
            embedding_function=_embeddings
        )
    return _vectorstore

def get_answer(question: str):
    """
    Retrieves context from ChromaDB and generates a response using Groq's Llama 3.1.
    """
    normalized_q = question.lower().strip()
    if normalized_q in _tech_cache:
        return _tech_cache[normalized_q]

    # Check API key
    api_key = os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set in the environment.")

    # Check Vector DB
    vs = get_vectorstore()
    if not vs:
        return {
            "answer": "The knowledge base is empty. Please run ingestion first.",
            "sources": []
        }
    
    # Configure retriever
    retriever = vs.as_retriever(
        search_type="mmr", 
        search_kwargs={"k": 8, "fetch_k": 30}  # Use MMR to diversify results and grab more chunks
    )

    # Initialize Groq LLM (llama-3.1-8b-instant)
    llm = ChatGroq(
        api_key=api_key,
        model_name="llama-3.1-8b-instant",
        temperature=0.1, # Low temperature to prevent hallucinations
        max_tokens=512
    )

    # Define prompt template specifically tailored to prevent hallucinations, handle recruiter questions, and act as a Tech Wiki
    template = """You are the AI Intelligence Terminal for Rutwik Chabukswar's classified mission archive.
You have two primary layers:
1. Portfolio Archive: Answers personal questions about Rutwik (projects, skills, experience) using ONLY the provided context.
2. Tech Wiki: Explains generic technical/programming concepts (e.g., "What is FastAPI?", "Explain React").

Answer the user's query intelligently, directly, and concisely.

CRITICAL TONE & FORMATTING RULES:
1. NEVER use introductory filler phrases. Start answering immediately.
2. NEVER mention "provided context", "training data", or "database". You are an intelligence terminal.
3. Keep answers extremely concise and punchy by default. Use bullet points (•) instead of long paragraphs whenever listing skills, projects, or experience.
4. Sound like a highly intelligent, professional archive assistant.
5. For personal questions about Rutwik, rely ENTIRELY on the retrieved context. Do not invent information about him.
6. If the question involves a generic technical concept, ALWAYS put a strictly accurate and concise technical explanation inside <TECH_WIKI>...</TECH_WIKI> tags at the end of your response.
7. For hybrid questions (e.g., "How did Rutwik use RAG?"), answer how Rutwik used it normally, and put the explanation of what RAG is inside <TECH_WIKI>...</TECH_WIKI> tags.
8. If a question is entirely unrelated to Rutwik or technology, say: "Intelligence not found in current archive."
9. For broad questions ("tell me about yourself", "why hire him"), summarize his strongest skills and projects into a compelling, short pitch using bullet points.
10. TECH WIKI LIMITATIONS: If the user asks about a technology that is NOT present in the retrieved context, you MUST explicitly state that this technology is currently outside Rutwik's expertise. NEVER fabricate technical experience for him.
11. TECH WIKI FORMATTING: When explaining any technology inside <TECH_WIKI>...</TECH_WIKI>, you MUST ALWAYS use this exact concise bulleted format:
[Technology Name]:
- [brief description of what it is]
- used in [Project Name 1]
- used in [Project Name 2]
12. SUGGESTED FOLLOW-UPS: If you answered a technical question, you MUST provide 3 relevant follow-up queries inside <SUGGESTIONS>...</SUGGESTIONS> tags at the very end of your response. Ensure they are simple, actionable, and separated by newlines. (Examples: "View SarkariSaathi project details", "See RAG implementation example", "What is ChromaDB?").

Context:
{context}

Query:
{question}

Response:"""
    
    prompt = ChatPromptTemplate.from_template(template)

    # Enhance query to boost project retrieval accuracy
    search_query = question
    lower_q = question.lower()
    project_keywords = ["project", "projects", "portfolio", "built", "created", "made", "develop", "ai", "frontend", "backend"]
    
    if any(kw in lower_q for kw in project_keywords):
        # Append targeted keywords to boost project chunk similarity in vector space
        search_query = f"{question} Projects Technical Experience Architecture"

    # Retrieve relevant documents
    docs = retriever.invoke(search_query)
    
    # Format context
    context = "\n\n".join(doc.page_content for doc in docs)
    
    # Generate the response
    chain = prompt | llm
    response = chain.invoke({"context": context, "question": question})
    
    content = response.content
    tech_wiki = None
    suggestions = None
    import re
    
    match_sug = re.search(r"<SUGGESTIONS>(.*?)</SUGGESTIONS>", content, re.DOTALL)
    if match_sug:
        sug_text = match_sug.group(1).strip()
        suggestions = [s.strip() for s in sug_text.split('\n') if s.strip()]
        content = re.sub(r"<SUGGESTIONS>.*?</SUGGESTIONS>", "", content, flags=re.DOTALL).strip()
        
    match_tech = re.search(r"<TECH_WIKI>(.*?)</TECH_WIKI>", content, re.DOTALL)
    if match_tech:
        tech_wiki = match_tech.group(1).strip()
        content = re.sub(r"<TECH_WIKI>.*?</TECH_WIKI>", "", content, flags=re.DOTALL).strip()
    
    # Return answer along with the source chunks and parsed metadata
    result = {
        "answer": content,
        "sources": [doc.page_content for doc in docs],
        "tech_wiki": tech_wiki,
        "suggestions": suggestions
    }
    
    if tech_wiki:
        _tech_cache[normalized_q] = result
        
    return result

if __name__ == "__main__":
    # Local test function
    test_question = "What are your key skills?"
    print(f"Q: {test_question}")
    try:
        res = get_answer(test_question)
        print(f"A: {res['answer']}\n")
        print("Sources:")
        for i, s in enumerate(res['sources'], 1):
            print(f"--- Source {i} ---\n{s}\n")
    except Exception as e:
        print(f"Error: {e}")
