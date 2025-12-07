import importlib.metadata
try:
    version = importlib.metadata.version("qdrant-client")
    print(f"Qdrant Client Version: {version}")
except Exception as e:
    print(f"Could not get version via importlib: {e}")

try:
    from qdrant_client import QdrantClient
    client = QdrantClient(":memory:")
    print(f"Has search? {hasattr(client, 'search')}")
    # print(f"Methods: {dir(client)}")
except Exception as e:
    print(f"Error instantiating client: {e}")
