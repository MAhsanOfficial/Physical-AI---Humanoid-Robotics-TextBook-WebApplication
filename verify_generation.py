from backend.rag.rag_pipeline import RAGPipeline
import traceback

print("--- Testing RAG Generation ---")
try:
    rag = RAGPipeline()
    print("RAG Pipeline initialized.")
    
    query = "What is Physical AI?"
    print(f"Querying: {query}")
    answer = rag.query(query)
    print(f"Answer:\n{answer}")
    
    if "Gemini Error" in answer or "I can only answer" in answer and "Physical AI" not in answer:
         print("[FAIL] Generation seemed to fail or return default refusal incorrectly (if content exists).")
    else:
         print("[SUCCESS] Generated a response.")

except Exception as e:
    print(f"[FAIL] Error: {e}")
    traceback.print_exc()
