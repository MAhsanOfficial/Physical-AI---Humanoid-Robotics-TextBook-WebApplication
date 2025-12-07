from qdrant_client import QdrantClient
import inspect

try:
    print("--- Local Memory Client ---")
    client = QdrantClient(":memory:")
    methods = [m for m in dir(client) if not m.startswith("_")]
    print(f"Methods: {methods}")
    
    print("\n--- Search-like methods ---")
    print([m for m in methods if "search" in m or "query" in m])
except Exception as e:
    print(e)
