import os
import google.generativeai as genai
from dotenv import load_dotenv

def test_gemini_setup():
    # Load .env
    load_dotenv("chatbot_config.env")
    load_dotenv() # Fallback to .env

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("[ERROR] GEMINI_API_KEY not found in environment.")
        return

    print(f"API Key found: {api_key[:5]}...{api_key[-3:]}")
    
    # Configure genai
    genai.configure(api_key=api_key)

    print("\n--- Listing Available Models ---")
    try:
        found_flash = False
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
                if "gemini-1.5-flash" in m.name:
                    found_flash = True
        
        if not found_flash:
            print("[WARNING] gemini-1.5-flash NOT found in list_models() output.")
        else:
            print("[SUCCESS] gemini-1.5-flash found.")

    except Exception as e:
        print(f"[ERROR] Failed to list models: {e}")
        return

    print("\n--- Testing Generation ---")
    models_to_test = ["gemini-1.5-flash", "gemini-2.0-flash-exp", "gemini-pro"]
    
    for model_name in models_to_test:
        print(f"Testing {model_name}...", end=" ")
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Hello")
            print(f"SUCCESS. Response: {response.text.strip()[:20]}...")
        except Exception as e:
            print(f"FAILED: {e}")

if __name__ == "__main__":
    test_gemini_setup()
