from backend.rag.rag_pipeline import RAGPipeline
import traceback

print("--- Testing RAGPipeline.chat() Method ---")

# The expected introduction message
INTRO_MESSAGE = "I am the Physical AI Book Assistant, a specialized chatbot created by Muhammad Ahsan to help you with the 'Physical AI Humanoid Robotics' textbook. You can ask me questions about the book's content."

try:
    print("Initializing Pipeline...")
    rag = RAGPipeline()
    
    # Test case 1: Query that should find relevant information
    print("\n--- Test Case 1: Relevant Query ---")
    print("Calling chat() with 'What is Physical AI?'...")
    response1 = rag.chat("What is Physical AI?", [])
    print(f"Chat Response (Relevant Query):\n{response1}")
    
    if "Gemini Chat Error" in response1 or "Error" in response1:
         print("[FAIL] Chat method returned an error for relevant query.")
    elif "I couldn't find a relevant answer" in response1 or response1 == INTRO_MESSAGE:
         print("[FAIL] Chat method returned an incorrect response for a relevant query.")
    else:
         print("[SUCCESS] Chat method worked for relevant query.")

    # Test case 2: Query that should NOT find relevant information
    print("\n--- Test Case 2: Irrelevant Query ---")
    print("Calling chat() with 'Tell me a story about a dragon?'...")
    response2 = rag.chat("Tell me a story about a dragon?", [])
    print(f"Chat Response (Irrelevant Query):\n{response2}")

    if "Please ask me a question related to this book." in response2:
         print("[SUCCESS] Chat method correctly returned 'not related to book' message for irrelevant query.")
    else:
         print(f"[FAIL] Chat method did NOT return 'not related to book' message for irrelevant query. Instead got: {response2}")

    # Test case 3: Greeting
    print("\n--- Test Case 3: Greeting Query ---")
    print("Calling chat() with 'Hello'...")
    response3 = rag.chat("Hello", [])
    print(f"Chat Response (Greeting Query):\n{response3}")

    if response3 == INTRO_MESSAGE:
         print("[SUCCESS] Chat method correctly returned the introduction for a greeting.")
    else:
         print(f"[FAIL] Chat method did NOT return the correct intro for a greeting. Instead got: {response3}")

    # Test case 4: Identity Question
    print("\n--- Test Case 4: Identity Query ---")
    print("Calling chat() with 'Who are you?'...")
    response4 = rag.chat("Who are you?", [])
    print(f"Chat Response (Identity Query):\n{response4}")

    if response4 == INTRO_MESSAGE:
         print("[SUCCESS] Chat method correctly returned the introduction for an identity query.")
    else:
         print(f"[FAIL] Chat method did NOT return the correct intro for an identity query. Instead got: {response4}")


except Exception as e:
    print(f"[FAIL] An unexpected error occurred: {e}")
    traceback.print_exc()
