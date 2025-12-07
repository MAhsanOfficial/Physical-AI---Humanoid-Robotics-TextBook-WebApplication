import uuid
from typing import List, Dict, Optional

from qdrant_client.http.models import Distance, VectorParams, PointStruct, Filter
from qdrant_client import QdrantClient

from backend.db.qdrant_client import get_qdrant_client, COLLECTION_NAME
from backend.rag.embeddings import get_embeddings, get_embedding

# Using COLLECTION_NAME from qdrant_client.py for consistency
EMBEDDING_DIM = 384  # Dimension for local all-MiniLM-L6-v2 model

def create_qdrant_collection(client: QdrantClient, collection_name: str = COLLECTION_NAME, force_recreate: bool = False):
    """
    Creates a Qdrant collection if it doesn't already exist.
    If force_recreate is True or dimensions mismatch, recreates the collection.
    """
    try:
        # Check if collection exists
        if client.collection_exists(collection_name=collection_name):
            # Check if dimensions match
            collection_info = client.get_collection(collection_name)
            current_dim = collection_info.config.params.vectors.size
            if current_dim != EMBEDDING_DIM or force_recreate:
                print(f"Recreating collection '{collection_name}' (dimension mismatch: {current_dim} vs {EMBEDDING_DIM})")
                client.delete_collection(collection_name=collection_name)
                client.create_collection(
                    collection_name=collection_name,
                    vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE),
                )
                print(f"Collection '{collection_name}' recreated with {EMBEDDING_DIM} dimensions.")
            else:
                print(f"Collection '{collection_name}' already exists with correct dimensions.")
        else:
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE),
            )
            print(f"Collection '{collection_name}' created with {EMBEDDING_DIM} dimensions.")
    except Exception as e:
        print(f"Error creating collection '{collection_name}': {e}")
        raise

def upsert_chunks_into_qdrant(
    client: QdrantClient,
    chunks: List[Dict],
    collection_name: str = COLLECTION_NAME
):
    """
    Inserts a list of text chunks with their metadata and embeddings into Qdrant.
    """
    if not chunks:
        print("No chunks to upsert.")
        return

    texts = [chunk['content'] for chunk in chunks]
    metadatas = [chunk['metadata'] for chunk in chunks]

    # Generate embeddings in batches
    # Consider batching requests to OpenAI for large number of texts
    batch_size = 100
    all_embeddings = []
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i + batch_size]
        try:
            batch_embeddings = get_embeddings(batch_texts)
            all_embeddings.extend(batch_embeddings)
        except Exception as e:
            print(f"Error generating embeddings for batch {i}-{i+batch_size}: {e}")
            raise # Re-raise to halt upsert if embeddings fail

    if len(all_embeddings) != len(texts):
        raise RuntimeError("Mismatch in number of embeddings generated and texts provided.")

    points = []
    for i, embedding in enumerate(all_embeddings):
        points.append(
            PointStruct(
                id=str(uuid.uuid4()),  # Generate a unique ID for each point
                vector=embedding,
                payload={"content": texts[i], **metadatas[i]}
            )
        )

    try:
        client.upsert(
            collection_name=collection_name,
            points=points,
            wait=True
        )
        print(f"Upserted {len(points)} points into collection '{collection_name}'.")
    except Exception as e:
        print(f"Error upserting points into collection '{collection_name}': {e}")
        raise

def search_qdrant(
    client: QdrantClient,
    query_text: str,
    collection_name: str = COLLECTION_NAME,
    limit: int = 5,
    query_filter: Optional[Filter] = None
) -> List[Dict]:
    """
    Searches the Qdrant collection for chunks similar to the query text.
    """
    query_embedding = get_embedding(query_text)

    try:
        # Use query_points (modern API)
        search_result = client.query_points(
            collection_name=collection_name,
            query=query_embedding,
            query_filter=query_filter,
            limit=limit,
            with_payload=True
        )

        results = []
        # query_points returns a QueryResponse object with a 'points' attribute
        hits = search_result.points if hasattr(search_result, 'points') else search_result
        
        for hit in hits:
            results.append({
                "content": hit.payload['content'],
                "source": hit.payload['source'],
                "score": hit.score
            })
        return results
    except Exception as e:
        print(f"Error searching Qdrant collection '{collection_name}': {e}")
        # Return empty list instead of crashing
        return []

if __name__ == "__main__":
    # Load environment variables from .env file
    from dotenv import load_dotenv, find_dotenv
    load_dotenv(find_dotenv())
    
    # Example usage:
    # 1. Ensure QDRANT_URL and QDRANT_API_KEY are set in your environment.
    # 2. Ensure GEMINI_API_KEY is set in your environment.

    import os
    from backend.rag.loader import load_markdown_documents
    from backend.rag.splitter import split_text_into_chunks

    # Placeholder for actual environment variables
    # os.environ["OPENAI_API_KEY"] = "YOUR_OPENAI_API_KEY" 
    # os.environ["QDRANT_URL"] = "YOUR_QDRANT_URL"       
    # os.environ["QDRANT_API_KEY"] = "YOUR_QDRANT_API_KEY" 
    
    # Check if environment variables are set
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("GEMINI_API_KEY or GOOGLE_API_KEY not set. Please set it in your environment.")
        exit(1)
    if not os.getenv("QDRANT_URL") or not os.getenv("QDRANT_API_KEY"):
        print("QDRANT_URL or QDRANT_API_KEY not set. Please set them in your environment.")
        exit(1)


    try:
        qdrant_client_instance = get_qdrant_client()
        create_qdrant_collection(qdrant_client_instance)

        print("\nLoading and splitting all markdown documents...")
        all_documents = load_markdown_documents()
        all_chunks = []
        for doc in all_documents:
            all_chunks.extend(split_text_into_chunks(doc))

        if all_chunks:
            print(f"Total chunks to upsert: {len(all_chunks)}")
            upsert_chunks_into_qdrant(qdrant_client_instance, all_chunks)
        else:
            print("No chunks generated from documents. Skipping upsert.")

        print("\nSearching Qdrant for 'ROS 2 communication fundamentals'...")
        search_results = search_qdrant(qdrant_client_instance, "ROS 2 communication fundamentals")
        for i, res in enumerate(search_results):
            print(f"--- Result {i+1} ---")
            print(f"Score: {res['score']:.4f}")
            print(f"Source: {res['source']}")
            print(f"Content: {res['content'][:200]}...\n")

        print("\nSearching Qdrant for 'humanoid robot balance'...")
        search_results_2 = search_qdrant(qdrant_client_instance, "humanoid robot balance")
        for i, res in enumerate(search_results_2):
            print(f"--- Result {i+1} ---")
            print(f"Score: {res['score']:.4f}")
            print(f"Source: {res['source']}")
            print(f"Content: {res['content'][:200]}...\n")

    except ValueError as e:
        print(f"Configuration Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
