import os
from dotenv import load_dotenv
from backend.db.qdrant_client import get_qdrant_client, COLLECTION_NAME
from backend.rag.vectorstore_qdrant import search_qdrant
from backend.rag.embeddings import get_embedding

# Load env
load_dotenv("chatbot_config.env")
load_dotenv()

print("\n--- RAG STATUS CHECK ---")

try:
    client = get_qdrant_client()
    
    # 1. Check Collection Existence
    if not client.collection_exists(COLLECTION_NAME):
        print(f"[FAIL] Collection '{COLLECTION_NAME}' does not exist!")
        exit(1)
        
    # 2. Check Document Count
    count = client.count(collection_name=COLLECTION_NAME).count
    print(f"[INFO] Collection '{COLLECTION_NAME}' contains {count} vector chunks.")
    
    if count == 0:
        print("[WARN] The database is EMPTY. RAG will not work.")
        print("Tip: The backend should auto-ingest on startup. Restart 'start_backend.bat'.")
        exit(1)

    # 3. Test Retrieval & Scores
    test_query = "What is Physical AI?"
    print(f"\n[TEST] Searching for: '{test_query}'")
    
    # Configure Gemini for embedding if needed (rag_pipeline does this, we need to do it here manually for standalone)
    # Actually embeddings.py usually handles the key if env var is set.
    # We might need to configure genai here if embeddings.py depends on it being configured externally, 
    # but embeddings.py usually imports genai.
    import google.generativeai as genai
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key.strip().strip('"').strip("'"))

    results = search_qdrant(client, test_query, COLLECTION_NAME, limit=3)
    
    if not results:
        print("[FAIL] Search returned NO results.")
    else:
        print(f"[SUCCESS] Found {len(results)} chunks.")
        for i, res in enumerate(results):
            score = res.get('score', 0)
            print(f"  Result {i+1}: Score = {score:.4f} | Source: {res['source']}")
            
            if score < 0.35:
                print("         [WARN] Low score! This would be filtered out by Strict Mode.")
            else:
                print("         [OK] High score. This would be accepted.")

    # 4. Test Irrelevant Query
    nonsense_query = "Who won the 2022 World Cup?"
    print(f"\n[TEST] Searching for Irrelevant Query: '{nonsense_query}'")
    bad_results = search_qdrant(client, nonsense_query, COLLECTION_NAME, limit=3)
    
    if bad_results:
        print(f"Found {len(bad_results)} chunks (Expected behavior, but scores should be low).")
        for i, res in enumerate(bad_results):
            score = res.get('score', 0)
            print(f"  Result {i+1}: Score = {score:.4f}")
            if score < 0.35:
                print("         [SUCCESS] Score is low. Strict Mode will correctly refusing this.")
            else:
                print("         [FAIL] Score is unexpectedly high for nonsense query!")
    else:
         print("[SUCCESS] No results found for nonsense query.")

except Exception as e:
    print(f"[ERROR] Diagnostic failed: {e}")
