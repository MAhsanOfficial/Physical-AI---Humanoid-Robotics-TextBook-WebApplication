from qdrant_client import QdrantClient
import inspect
import sys

try:
    client = QdrantClient(":memory:")
    print("--- Help for query_points ---")
    # print(help(client.query_points)) # help prints to stdout, but let's capture it or just inspect signature
    print(inspect.signature(client.query_points))
    print(client.query_points.__doc__)
except Exception as e:
    print(e)
