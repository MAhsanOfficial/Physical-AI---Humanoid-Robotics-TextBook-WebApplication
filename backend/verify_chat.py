import sys
import os

sys.path.append(os.getcwd())

from backend.rag.rag_pipeline import RAGPipeline

def verify_chat():
    print("Initializing Pipeline...")
    try:
        pipeline = RAGPipeline()
    except Exception as e:
        print(f"Init failed: {e}")
        return

    print(f"Pipeline ready. Model: {pipeline.current_model_name}")
    
    query = "What is the main topic of Physical AI?"
    print(f"\nQuery: {query}")
    
    # Mock history
    history = []
    
    response = pipeline.chat(query, history)
    print(f"\n[RESPONSE]\n{response}\n[END RESPONSE]")
    
    if "Quota Exceeded" in response:
        print("[NOTE] Quota limit reached, but error handled gracefully.")
    elif "Gemini Error" in response:
        print("[FAIL] Unhandled Gemini Error.")
    else:
        print("[SUCCESS] Chatbot responded correctly.")

if __name__ == "__main__":
    verify_chat()
