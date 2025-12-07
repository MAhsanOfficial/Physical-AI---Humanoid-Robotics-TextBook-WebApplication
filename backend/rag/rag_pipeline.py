import os
from typing import List, Dict, Optional
import google.generativeai as genai

from backend.rag.loader import load_markdown_documents
from backend.rag.splitter import split_text_into_chunks
from backend.rag.embeddings import get_embedding
from backend.rag.vectorstore_qdrant import create_qdrant_collection, upsert_chunks_into_qdrant, search_qdrant
from backend.db.qdrant_client import get_qdrant_client, COLLECTION_NAME

class RAGPipeline:
    def __init__(self, docs_dir: str = "physical-ai-book/docs", embedding_model: str = "models/embedding-001"):
        self.docs_dir = docs_dir
        self.embedding_model = embedding_model
        
        self.qdrant_client = get_qdrant_client()
        
        # Ensure env vars are loaded
        from dotenv import load_dotenv
        load_dotenv("chatbot_config.env")
        load_dotenv() 

        # Support GEMINI_API_KEY or fallback to OPENAI_API_KEY if user pasted it there
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
        
        # Clean the key (remove spaces, quotes if user added them)
        if api_key:
            api_key = api_key.strip().strip('"').strip("'")
            print(f"Loaded API Key: {api_key[:5]}...{api_key[-3:] if len(api_key)>5 else ''}")
        else:
            print("No API Key found in environment variables.")

        if not api_key or "REPLACE_THIS" in api_key or "TYPE_YOUR_KEY" in api_key:
             raise ValueError("INVALID KEY: Key looks like a placeholder. Please check your .env/chatbot_config.env file.")
        
        genai.configure(api_key=api_key)
        
        genai.configure(api_key=api_key)
        
        # Store candidates for fallback logic
        # Using multiple models to maximize chances of finding one with available quota
        self.candidates = [
            "models/gemini-2.5-flash",
            "models/gemini-2.0-flash-lite",
            "models/gemini-2.0-flash-lite-001",
            "models/gemini-2.0-pro-exp",
            "models/gemini-pro-latest",
            "models/gemma-3-27b-it",
            "gemini-2.0-flash-exp",
            "gemini-flash-latest"
        ]
        
        self.current_model_name = None
        self.model = self._select_working_model()

    def _select_working_model(self):
        print("\n[AUTO-FIX] Testing Gemini models to find a working one...")
        for candidate in self.candidates:
            print(f"Testing: {candidate} ...", end=" ")
            try:
                test_model = genai.GenerativeModel(candidate)
                # Actual generation test
                response = test_model.generate_content("Test")
                if response:
                    print("SUCCESS! [OK]")
                    self.current_model_name = candidate
                    return test_model
            except Exception as e:
                print(f"Failed ({e}) [X]")
        
        print("\n[WARNING] All Gemini models failed check (likely Quota or Auth).")
        # Default to requested model even if check failed, and let runtime handle 429s gracefully
        fallback = "models/gemini-2.5-flash"
        self.current_model_name = fallback
        return genai.GenerativeModel(fallback)

        # Ensure Qdrant collection exists
        create_qdrant_collection(self.qdrant_client, COLLECTION_NAME)

        # Check if collection is empty, if so, ingest automatically
        collection_exists = self.qdrant_client.collection_exists(collection_name=COLLECTION_NAME)
        should_ingest = False
        if not collection_exists:
            print(f"Collection '{COLLECTION_NAME}' does not exist. Will create and ingest.")
            should_ingest = True
        else:
            try:
                # Use exact=False for a faster, approximate count
                count = self.qdrant_client.count(collection_name=COLLECTION_NAME, exact=False).count
                if count == 0:
                    print(f"Collection '{COLLECTION_NAME}' is empty. Auto-ingesting documents...")
                    should_ingest = True
                else:
                    print(f"Collection '{COLLECTION_NAME}' already contains {count} documents.")
            except Exception as e:
                print(f"[WARNING] Could not determine document count in '{COLLECTION_NAME}': {e}")
                print("[INFO] Assuming ingestion is needed due to check failure. You can manually re-trigger ingestion via the /embed-book endpoint if needed.")
                should_ingest = True # Proceed with ingestion if count fails

        if should_ingest:
            self.ingest_documents()

    def ingest_documents(self, force_recreate: bool = True):
        print(f"Loading documents from {self.docs_dir}...")
        documents = load_markdown_documents(self.docs_dir)
        print(f"Loaded {len(documents)} raw documents.")

        # If forcing recreate, we should verify the collection is clean
        if force_recreate:
             # Just upserting chunks is fine if the collection is fresh, 
             # but to be safe effectively, we should rely on vectorstore_qdrant.create_qdrant_collection logic if we were calling it.
             # However, main.py calls this. Let's make sure we clear it first for consistency.
             try:
                self.qdrant_client.delete_collection(COLLECTION_NAME)
                create_qdrant_collection(self.qdrant_client, COLLECTION_NAME) 
                print("Collection recreated for fresh ingestion.")
             except Exception as e:
                print(f"Error recreating collection during ingest: {e}")

        all_chunks = []
        for doc in documents:
            chunks = split_text_into_chunks(doc)
            all_chunks.extend(chunks)
        print(f"Split into {len(all_chunks)} chunks.")

        if all_chunks:
            upsert_chunks_into_qdrant(self.qdrant_client, all_chunks, COLLECTION_NAME)
        else:
            print("No chunks generated from documents.")

    def query(self, query_text: str, limit: int = 5, selected_passage_content: Optional[str] = None) -> str:
        if selected_passage_content:
            context_chunks = [{"content": selected_passage_content, "source": "selected_passage"}]
            print("Querying with selected passage only.")
        else:
            print(f"Searching Qdrant: '{query_text}'...")
            try:
                retrieved_chunks = search_qdrant(self.qdrant_client, query_text, COLLECTION_NAME, limit=limit)
            except Exception as e:
                print(f"Search failed: {e}")
                retrieved_chunks = []
            
        # Strict RAG: Minimum Similarity Score
        # Adjusted to 0.25 to be slightly more lenient while keeping relevance
        SCORE_THRESHOLD = 0.25 

        if not retrieved_chunks:
            return "I couldn't find relevant info in the book."
        
        # Filter by score
        context_chunks = [c for c in retrieved_chunks if c.get('score', 0) >= SCORE_THRESHOLD]
        
        if not context_chunks:
            print(f"[STRICT RAG] Found chunks but all below threshold {SCORE_THRESHOLD}. Highest was: {retrieved_chunks[0].get('score')}")
            # Relaxed: don't auto-reject here, maybe let fallback handle it in chat() or just return best match if close?
            # For query() strictness is usually desired.
            return "I can only answer questions contained within the Physical AI book references."

        context_text = "\n\n".join([f"Source: {chunk['source']}\nContent: {chunk['content']}" for chunk in context_chunks])
        
        prompt = (
            "You are a specialized AI Assistant for the 'Physical AI Humanoid Robotics' textbook. "
            "Your knowledge is strictly limited to the provided context. "
            "Do NOT use any outside knowledge or training data. "
            "If the answer to the user's question is not directly present in the context below, "
            "you MUST reply: 'I can only answer questions contained within the Physical AI book references.'\n\n"
            f"Context:\n{context_text}\n\n"
            f"Question: {query_text}\nAnswer:"
        )

        print("Generating Gemini response...")
        return self._generate_with_fallback(prompt)

    def _generate_with_fallback(self, prompt: str) -> str:
        try:
            # Explicitly set the model to the selected one (self.model is already instantiated)
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "quota" in error_str.lower():
                print(f"[ERROR] Quota Exceeded: {e}")
                return "⚠️ **System Busy (Quota Exceeded)**: The AI model is currently overloaded. Please try again in a few minutes."
            elif "404" in error_str or "not found" in error_str.lower():
                print(f"[WARNING] Primary model failed: {e}.")
                return f"Gemini Error (Model Not Found): {e} (Tried: {self.current_model_name})"
            else:
                return f"Gemini Error: {e}"

    def translate(self, text: str, target_language: str = "Urdu") -> str:
        prompt = f"Translate the following text into {target_language}. Provide only the translation.\n\nText: {text}"
        return self._generate_with_fallback(prompt)

    def chat(self, query_text: str, chat_history: List[Dict[str, str]], limit: int = 5) -> str:
        # --- Start of new introductory logic ---
        normalized_query = query_text.lower().strip("?.,! ")
        
        # Define triggers for the introduction
        greeting_triggers = ["hi", "hello", "hey"]
        identity_triggers = ["who are you", "what are you"]

        if normalized_query in greeting_triggers or normalized_query in identity_triggers:
            return "I am the Physical AI Book Assistant, a specialized chatbot created by Muhammad Ahsan to help you with the 'Physical AI Humanoid Robotics' textbook. You can ask me questions about the book's content."
        # --- End of new introductory logic ---

        print(f"Chat Search: '{query_text}'...")
        try:
            retrieved_chunks = search_qdrant(self.qdrant_client, query_text, COLLECTION_NAME, limit=limit)
        except:
            retrieved_chunks = []

        SCORE_THRESHOLD = 0.18
        
        if not retrieved_chunks:
             valid_chunks = []
        else:
             valid_chunks = [c for c in retrieved_chunks if c.get('score', 0) >= SCORE_THRESHOLD]

        if not valid_chunks:
            # Get the score of the top-ranked chunk if it exists for logging
            top_score = 0
            if retrieved_chunks:
                top_score = retrieved_chunks[0].get('score', 0)
            
            print(f"[STRICT RAG] No chunks passed score threshold of {SCORE_THRESHOLD}. Highest score was {top_score:.4f}.")
            return "Please ask me a question related to this book. I only answer questions from this content."
        
        context_text = "\n\n".join([f"Source: {chunk['source']}\nContent: {chunk['content']}" for chunk in valid_chunks])

        # Prepare chat history string
        history_str = ""
        for msg in chat_history:
            role_label = "User" if msg["role"] == "user" else "Assistant"
            history_str += f"{role_label}: {msg['content']}\n"
        
        full_prompt = (
            "SYSTEM INSTRUCTION: You are a strict RAG Chatbot for the 'Physical AI Humanoid Robotics' textbook. "
            "Use ONLY the provided context below. Ignore your base training data. "
            "If the answer is not found in the context, refuse to answer.\n"
            "If the info is missing, say: 'I can only answer questions contained within the Physical AI book references.'\n\n"
            f"Context from book:\n{context_text}\n\n"
            "--- Chat History ---\n"
            f"{history_str}\n"
            f"User: {query_text}\n"
            "Assistant (Strictly from Context):"
        )
        
        print(f"Generating Gemini Chat response (Stateless Mode)...")
        # Use _generate_with_fallback directly, bypassing start_chat() which was causing hangs
        return self._generate_with_fallback(full_prompt)
