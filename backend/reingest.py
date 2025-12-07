import os
import sys

# Ensure backend path is in python path
sys.path.append(os.getcwd())

from backend.db.qdrant_client import get_qdrant_client, COLLECTION_NAME
from backend.rag.loader import load_markdown_documents
from backend.rag.splitter import split_text_into_chunks
from backend.rag.vectorstore_qdrant import create_qdrant_collection, upsert_chunks_into_qdrant

def reingest():
    print("Initializing Qdrant client...")
    client = get_qdrant_client()
    
    print(f"Deleting existing collection '{COLLECTION_NAME}'...")
    client.delete_collection(collection_name=COLLECTION_NAME)
    
    print(f"Creating fresh collection '{COLLECTION_NAME}'...")
    create_qdrant_collection(client, collection_name=COLLECTION_NAME)
    
    docs_dir = "physical-ai-book/docs"
    print(f"Loading documents from {docs_dir}...")
    documents = load_markdown_documents(docs_dir)
    print(f"Loaded {len(documents)} documents.")
    
    all_chunks = []
    print("Splitting documents...")
    for doc in documents:
        chunks = split_text_into_chunks(doc)
        all_chunks.extend(chunks)
    print(f"Total chunks generated: {len(all_chunks)}")
    
    if all_chunks:
        print("Upserting chunks into Qdrant (this may take a minute)...")
        upsert_chunks_into_qdrant(client, all_chunks, COLLECTION_NAME)
        print("[SUCCESS] Re-ingestion complete!")
    else:
        print("[WARNING] No chunks found to ingest.")

if __name__ == "__main__":
    reingest()
