import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv("chatbot_config.env")
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# Extended list to find one with quota
models_to_test = [
    "models/gemini-2.5-flash",
    "models/gemini-2.0-flash-lite",
    "models/gemini-2.0-flash-lite-001",
    "models/gemini-2.0-pro-exp",
    "models/gemini-pro-latest",
    "models/gemma-3-27b-it",
    "models/gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-flash-latest"
]

print("--- Testing models for available quota ---")
for model_name in models_to_test:
    print(f"Testing {model_name}...", end=" ")
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hello")
        print(f"SUCCESS: {response.text.strip()[:30]}...")
        print(f"\n==> WORKING MODEL FOUND: {model_name}")
        break
    except Exception as e:
        error_str = str(e)
        if "429" in error_str:
            print(f"QUOTA EXCEEDED")
        elif "404" in error_str:
            print(f"NOT FOUND")
        else:
            print(f"ERROR: {str(e)[:50]}")
else:
    print("\n==> No models have available quota. Wait for reset or upgrade API plan.")
