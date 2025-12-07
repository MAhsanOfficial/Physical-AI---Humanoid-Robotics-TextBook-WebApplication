import sys
import os

# Ensure backend path is in python path
sys.path.append(os.path.join(os.getcwd()))

from backend.rag.rag_pipeline import RAGPipeline

def test_pipeline():
    print("Initializing RAG Pipeline...")
    try:
        pipeline = RAGPipeline()
        print(f"[SUCCESS] Pipeline initialized. Selected model: {pipeline.current_model_name}")
    except Exception as e:
        print(f"[FAIL] Pipeline init failed: {e}")
        return

    query = "What is Physical AI?"
    print(f"\nTesting Query: '{query}'")
    try:
        answer = pipeline.query(query)
        print(f"\n[ANSWER]\n{answer}\n[END ANSWER]")
        if "Gemini Error" in answer:
            print("[FAIL] Gemini Error detected in response.")
        else:
            print("[SUCCESS] Chatbot returned a valid response.")
    except Exception as e:
        print(f"[FAIL] Query execution failed: {e}")

if __name__ == "__main__":
    test_pipeline()
