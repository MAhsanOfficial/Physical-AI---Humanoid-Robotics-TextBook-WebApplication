"""
MANUAL DATA INGESTION SCRIPT
This script will load all book content into the RAG database.
Run this ONCE to populate the chatbot's knowledge base.
"""
import os
import google.generativeai as genai
from dotenv import load_dotenv
from backend.rag.loader import load_markdown_documents
from backend.rag.splitter import split_text_into_chunks
from backend.rag.vectorstore_qdrant import create_qdrant_collection, upsert_chunks_into_qdrant
from backend.db.qdrant_client import get_qdrant_client, COLLECTION_NAME

# Load environment variables
load_dotenv("chatbot_config.env")
load_dotenv()

print("\n" + "="*60)
print("LOADING BOOK DATA INTO RAG SYSTEM")
print("="*60 + "\n")

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
if api_key:
    api_key = api_key.strip().strip('"').strip("'")
    genai.configure(api_key=api_key)
    print(f"[OK] API Key configured: {api_key[:5]}...{api_key[-3:]}\n")
else:
    print("✗ ERROR: No API key found!")
    exit(1)

# Connect to Qdrant
print("Connecting to Qdrant...")
qdrant_client = get_qdrant_client()

# Create collection
print(f"Creating/checking collection '{COLLECTION_NAME}'...")
create_qdrant_collection(qdrant_client, COLLECTION_NAME)

# Load documents
docs_dir = "physical-ai-book/docs"
print(f"\nLoading markdown files from '{docs_dir}'...")
documents = load_markdown_documents(docs_dir)
print(f"[OK] Loaded {len(documents)} raw document files.\n")

if not documents:
    print("✗ ERROR: No documents found!")
    print(f"Please check that '{docs_dir}' exists and contains .md/.mdx files.")
    exit(1)

# Split into chunks
print("Splitting documents into chunks...")
all_chunks = []
for i, doc in enumerate(documents, 1):
    chunks = split_text_into_chunks(doc)
    all_chunks.extend(chunks)
    if i % 10 == 0:
        print(f"  Processed {i}/{len(documents)} documents...")

print(f"[OK] Created {len(all_chunks)} text chunks.\n")

if not all_chunks:
    print("✗ ERROR: No chunks generated!")
    exit(1)

# Upsert into Qdrant (this will generate embeddings and store them)
print("Generating embeddings and storing in database...")
print("(This may take 1-2 minutes for large books)")
print("-" * 60)

try:
    upsert_chunks_into_qdrant(qdrant_client, all_chunks, COLLECTION_NAME)
    print("-" * 60)
    print("\n[SUCCESS] [SUCCESS] [SUCCESS]")
    print(f"\nLoaded {len(all_chunks)} chunks into the RAG database.")
    print("\nThe chatbot is now ready to answer questions from the book!")
    print("\nYou can now restart the backend and test the chatbot.")
except Exception as e:
    print(f"\n✗ ERROR during ingestion: {e}")
    exit(1)
