import os
from qdrant_client import QdrantClient

COLLECTION_NAME = "physical_ai_textbook_gemini"

def get_qdrant_client():
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")

    if qdrant_url:
        print(f"Connecting to Qdrant at {qdrant_url}")
        client = QdrantClient(
            url=qdrant_url,
            api_key=qdrant_api_key,
        )
    else:
        print("QDRANT_URL not set. Using local Qdrant storage at './qdrant_data'.")
        # Ensure the directory exists or let QdrantClient handle it
        client = QdrantClient(path="./qdrant_data")
    
    return client

if __name__ == "__main__":
    # Example usage (for testing purposes)
    # Make sure to set QDRANT_URL and QDRANT_API_KEY in your environment
    # e.g., export QDRANT_URL="YOUR_QDRANT_URL"
    # e.g., export QDRANT_API_KEY="YOUR_QDRANT_API_KEY"
    try:
        qdrant_client = get_qdrant_client()
        print("Qdrant client initialized successfully.")
        # You can add a simple check here, e.g., list collections
        # print(qdrant_client.get_collections())
    except ValueError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")