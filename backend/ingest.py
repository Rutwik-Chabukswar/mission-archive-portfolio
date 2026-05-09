import os
import re
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
CHROMA_DB_DIR = os.path.join(BASE_DIR, "chroma_db")

def clean_text(text: str) -> str:
    """Cleans extracted text to improve embedding quality."""
    # Replace multiple newlines with a single newline
    text = re.sub(r'\n+', '\n', text)
    # Replace multiple spaces with a single space
    text = re.sub(r'\s{2,}', ' ', text)
    return text.strip()

def ingest_documents():
    """
    Ingests PDFs, cleans text, performs section-aware chunking,
    and stores vector embeddings in ChromaDB using MiniLM.
    """
    print(f"Loading PDFs from {DATA_DIR}...")
    loader = PyPDFDirectoryLoader(DATA_DIR)
    documents = loader.load()

    if not documents:
        print("No documents found in the data directory.")
        return False

    print(f"Loaded {len(documents)} document pages.")

    # Clean the text
    for doc in documents:
        doc.page_content = clean_text(doc.page_content)

    # Section-aware chunking
    print("Splitting text into semantic chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=["\n\n", "\n", ".", " ", ""],
        length_function=len
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks.")

    # Initialize local embeddings (all-MiniLM-L6-v2)
    print("Generating embeddings and storing in ChromaDB...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Create or update Vector Store
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DB_DIR
    )
    
    print("Ingestion complete. Vector store saved to:", CHROMA_DB_DIR)
    return True

if __name__ == "__main__":
    ingest_documents()
