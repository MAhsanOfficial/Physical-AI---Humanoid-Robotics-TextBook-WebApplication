import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load env vars
load_dotenv("chatbot_config.env")
load_dotenv() 

api_key = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")

if not api_key:
    print("No API Key found.")
    exit(1)

# Clean key
api_key = api_key.strip().strip('"').strip("'")
genai.configure(api_key=api_key)

print(f"Checking models for key: {api_key[:5]}...")

try:
    print("\n--- Available Models ---")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name} (Display: {m.displayName})")
            
    print("\n--- Available Embedding Models ---")
    for m in genai.list_models():
        if 'embedContent' in m.supported_generation_methods:
            print(f"- {m.name}")
            
except Exception as e:
    print(f"Error listing models: {e}")

input("\nPress Enter to exit...")
