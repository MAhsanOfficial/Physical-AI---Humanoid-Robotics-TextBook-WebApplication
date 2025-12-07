import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv("chatbot_config.env")
load_dotenv() 

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

model_name = "models/gemini-pro-latest"

print(f"Testing {model_name}...")
try:
    model = genai.GenerativeModel(model_name)
    response = model.generate_content("Hello")
    print(f"SUCCESS: {response.text}")
except Exception as e:
    print(f"FAILED: {e}")
