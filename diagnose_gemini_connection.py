import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load env vars
load_dotenv("chatbot_config.env")
load_dotenv() 

print("\n--- GEMINI CONNECTION DIAGNOSTIC ---")

# 1. Check API Key presence
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")

if not api_key:
    print("[FAIL] No API Key found in environment variables.")
    print("Please set GEMINI_API_KEY in chatbot_config.env")
    input("Press Enter to exit...")
    exit(1)

# Clean key
api_key = api_key.strip().strip('"').strip("'")
print(f"[OK] API Key loaded: {api_key[:5]}...{api_key[-3:]}")

genai.configure(api_key=api_key)

# 2. Check Model Listing (This proves if the API is enabled)
print("\n[STEP 1] Listing Available Models...")
try:
    models = list(genai.list_models())
    print(f"[OK] Successfully connected to Google API.")
    
    text_models = [m for m in models if 'generateContent' in m.supported_generation_methods]
    
    if not text_models:
        print("[WARN] Connected, but NO text generation models found for this key!")
        print("This usually means 'Generative Language API' is disabled in your Google Cloud Console.")
    else:
        print(f"[OK] Found {len(text_models)} text models:")
        for m in text_models:
            print(f" - {m.name}")

except Exception as e:
    print(f"[FAIL] Could not list models.")
    print(f"Error: {e}")
    print("\nPOSSIBLE CAUSES:")
    print("1. API Key is invalid.")
    print("2. 'Generative Language API' is NOT enabled in your Google Cloud Project.")
    print("2. 'Generative Language API' is NOT enabled in your Google Cloud Project.")
    print("3. Internet connection blocked.")
    exit(1)

# 3. Test Generation
print("\n[STEP 2] Testing Content Generation...")
test_model_name = "gemini-1.5-flash"

# Fallback checking
model_names = [m.name for m in text_models]
if any("gemini-1.5-flash" in m for m in model_names):
    test_model_name = "gemini-1.5-flash"
elif any("gemini-pro" in m for m in model_names):
    test_model_name = "gemini-pro"
elif text_models:
    test_model_name = text_models[0].name

print(f"Testing with model: {test_model_name}")

try:
    model = genai.GenerativeModel(test_model_name)
    response = model.generate_content("Hello, can you hear me?")
    print(f"[SUCCESS] Gemini Replied: {response.text}")
    print("\nCONCLUSION: The API Key works perfectly!")
except Exception as e:
    print(f"[FAIL] Generation failed: {e}")
