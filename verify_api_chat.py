
import requests
import json
import time
import sys

def verify_chat_api():
    url = "http://localhost:8000/chat"
    headers = {"Content-Type": "application/json"}
    payload = {
        "message": "What is Physical AI?",
        "session_id": None
    }
    
    print(f"Sending POST request to {url}...")
    print(f"Payload: {json.dumps(payload)}")
    
    start_time = time.time()
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        end_time = time.time()
        
        print(f"Response Status: {response.status_code}")
        print(f"Time Taken: {end_time - start_time:.2f}s")
        
        if response.status_code == 200:
            print("Response Body:")
            print(json.dumps(response.json(), indent=2))
            print("\n[SUCCESS] Chat endpoint is working correctly.")
        else:
            print(f"Response Error: {response.text}")
            print("\n[FAIL] Chat endpoint returned an error.")
            
    except requests.exceptions.ConnectionError:
        print("\n[FAIL] Connection refused. Is the backend server running? (start_backend.bat)")
    except requests.exceptions.Timeout:
        print("\n[FAIL] Request timed out after 30 seconds. The backend is hanging.")
    except Exception as e:
        print(f"\n[FAIL] Error: {e}")

if __name__ == "__main__":
    verify_chat_api()
