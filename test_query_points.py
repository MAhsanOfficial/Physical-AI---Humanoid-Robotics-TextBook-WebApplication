from qdrant_client import QdrantClient
from qdrant_client.http import models

try:
    client = QdrantClient(":memory:")
    # Create dummy collection
    client.create_collection("test", vectors_config=models.VectorParams(size=2, distance=models.Distance.COSINE))
    client.upsert("test", points=[models.PointStruct(id=1, vector=[0.1, 0.2], payload={"content": "hello"})])
    
    print("--- Testing query_points ---")
    res = client.query_points("test", query=[0.1, 0.2], limit=1, with_payload=True)
    print(f"Type: {type(res)}")
    print(f"Result: {res}")
    
    if hasattr(res, 'points'):
        print("Iterating res.points:")
        for hit in res.points:
            print(f"Hit content: {hit.payload}")
            print(f"Hit score: {hit.score}")
    else:
        print("Iterating res directly (if list-like):")
        try:
            for hit in res:
                print(f"Hit content: {hit.payload}")
        except:
            print("Not iterable directly.")

except Exception as e:
    print(f"Error: {e}")
