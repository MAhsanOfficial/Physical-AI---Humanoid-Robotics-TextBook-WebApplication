import os
from typing import List

# Use local sentence-transformers for embeddings (no API quota limits)
USE_LOCAL_EMBEDDINGS = True  # Set to False to use Gemini API

# Local model singleton
_local_model = None

def get_local_model():
    """Get or create local sentence-transformers model."""
    global _local_model
    if _local_model is None:
        print("Loading local embedding model (first time may take a moment)...")
        from sentence_transformers import SentenceTransformer
        # all-MiniLM-L6-v2 produces 384-dim vectors, works well for RAG
        _local_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Local embedding model loaded successfully!")
    return _local_model

def get_embedding(text: str, model: str = "models/embedding-001") -> List[float]:
    """
    Generates an embedding for the given text.
    Uses local sentence-transformers by default (no API limits).
    """
    text = text.replace("\n", " ")
    
    if USE_LOCAL_EMBEDDINGS:
        local_model = get_local_model()
        embedding = local_model.encode(text, convert_to_numpy=True)
        return embedding.tolist()
    else:
        # Gemini API fallback
        import google.generativeai as genai
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY or GOOGLE_API_KEY environment variable must be set.")
        genai.configure(api_key=api_key)
        
        try:
            result = genai.embed_content(
                model=model,
                content=text,
                task_type="retrieval_document",
                title="Embedded Document" 
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating embedding: {e}")
            raise

def get_embeddings(texts: List[str], model: str = "models/embedding-001") -> List[List[float]]:
    """
    Generates embeddings for a list of texts.
    Uses local sentence-transformers by default (no API limits).
    """
    processed_texts = [text.replace("\n", " ") for text in texts]
    
    if USE_LOCAL_EMBEDDINGS:
        local_model = get_local_model()
        embeddings = local_model.encode(processed_texts, convert_to_numpy=True, show_progress_bar=True)
        return [emb.tolist() for emb in embeddings]
    else:
        # Gemini API fallback
        import google.generativeai as genai
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable must be set.")
        genai.configure(api_key=api_key)
        
        try:
            embeddings = []
            for txt in processed_texts:
                result = genai.embed_content(
                    model=model,
                    content=txt,
                    task_type="retrieval_document"
                )
                embeddings.append(result['embedding'])
            return embeddings
        except Exception as e:
            print(f"Error generating embeddings for batch: {e}")
            raise

