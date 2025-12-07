from backend.rag.rag_pipeline import RAGPipeline
from backend.rag.vectorstore_qdrant import search_qdrant, COLLECTION_NAME

def diagnose_scores():
    print("--- Diagnosing Retrieval Scores ---")
    try:
        rag = RAGPipeline()
        client = rag.qdrant_client
        
        test_queries = [
            "What is Physical AI?",
            "Explain ROS2",
            "Who is the author?"
        ]
        
        for q in test_queries:
            print(f"\nQuerying: '{q}'")
            results = search_qdrant(client, q, COLLECTION_NAME, limit=5)
            
            if not results:
                print("  [WARN] No results found at all.")
                continue
                
            for i, res in enumerate(results):
                score = res.get('score', 0)
                status = "[PASS]" if score >= 0.35 else "[FAIL]"
                print(f"  Result {i+1}: Score = {score:.4f} {status}")
                print(f"    Content Preview: {res['content'][:100]}...")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    diagnose_scores()
