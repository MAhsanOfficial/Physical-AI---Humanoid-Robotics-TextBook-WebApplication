from qdrant_client import QdrantClient
print(dir(QdrantClient))
try:
    client = QdrantClient(":memory:")
    print("Methods:", [m for m in dir(client) if "search" in m or "query" in m])
except Exception as e:
    print(e)
