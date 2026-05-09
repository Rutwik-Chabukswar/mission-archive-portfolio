import os
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHROMA_DB_DIR = os.path.join(BASE_DIR, "chroma_db")

# Initialize expensive models globally so they don't reload on every request
_embeddings = None
_vectorstore = None

def get_vectorstore():
    global _embeddings, _vectorstore
    if _vectorstore is None:
        if not os.path.exists(CHROMA_DB_DIR) or not os.listdir(CHROMA_DB_DIR):
            return None
        _embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        _vectorstore = Chroma(persist_directory=CHROMA_DB_DIR, embedding_function=_embeddings)
    return _vectorstore

def get_answer(question: str):
    """
    Retrieves context from ChromaDB and generates a response using Groq's Llama 3.1.
    """
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

    # Define prompt template specifically tailored to prevent hallucinations and handle recruiter questions
    template = """You are the AI Intelligence Terminal for Rutwik Chabukswar's classified mission archive.
Answer the user's query intelligently, directly, and concisely.

CRITICAL TONE & FORMATTING RULES:
1. NEVER use introductory filler phrases like "Based on the context...", "According to the document...", "Here is a pitch...", or "Here are the projects...". Start answering immediately.
2. NEVER mention "provided context", "training data", "documents", or "database". You are an intelligence terminal, not a document reader.
3. Keep answers extremely concise and punchy by default. Use bullet points (•) instead of long paragraphs whenever listing skills, projects, or experience.
4. Sound like a highly intelligent, professional archive assistant.
5. If the context does not contain the answer, say: "Intelligence not found in current archive. Please query regarding Rutwik's skills, experience, or specific projects."
6. DO NOT invent or assume any information. Rely entirely on the retrieved data.
7. For broad questions ("tell me about yourself", "why hire him"), summarize his strongest skills and projects into a compelling, short pitch using bullet points.
8. Only provide deep technical details when the user explicitly asks for them.

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
    
    # Return answer along with the source chunks
    return {
        "answer": response.content,
        "sources": [doc.page_content for doc in docs]
    }

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
