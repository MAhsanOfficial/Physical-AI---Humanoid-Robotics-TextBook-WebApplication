import os
from dotenv import load_dotenv, find_dotenv
from backend.rag.rag_pipeline import RAGPipeline

def test_pipeline():
    print("--- Starting RAG Pipeline Diagnostic ---")
    print(f"Current Directory: {os.getcwd()}")
    
    # Mirror production loading logic
    from dotenv import load_dotenv
    load_dotenv("chatbot_config.env")
    
    # 1. Check API Key
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        print("[ERROR] OPENAI_API_KEY is missing in .env file!")
        return
    print(f"[SUCCESS] Found API Key: {api_key[:5]}...***")

    try:
        # 2. Initialize Pipeline
        print("Initializing RAG Pipeline...")
        pipeline = RAGPipeline()
        print("[SUCCESS] Pipeline initialized.")

        # 3. Check Qdrant
        print("Checking Qdrant Collection...")
        try:
            # Simple peek into the collection
            count_info = pipeline.qdrant_client.count(collection_name="physical_ai_textbook")
            print(f"[INFO] Documents in knowledge base: {count_info.count}")
            
            if count_info.count == 0:
                print("[WARNING] Knowledge base is empty! Attempting to ingest documents now...")
                pipeline.ingest_documents()
                print("[SUCCESS] Ingestion complete.")
        except Exception as e:
            print(f"[ERROR] Qdrant Error: {e}")
            return

        # 4. Test Query
        print("Testing basic query to OpenAI...")
        response = pipeline.query("Hello, who are you?")
        print(f"[RESPONSE] AI says: {response}")

    except Exception as e:
        print(f"[FATAL ERROR] Pipeline failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_pipeline()
    input("\nPress Enter to exit...")
