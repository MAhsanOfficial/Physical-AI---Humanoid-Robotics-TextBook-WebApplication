import requests
import json

response = requests.post(
    'http://localhost:8000/translate',
    json={
        'text': 'Hello, welcome to the Physical AI book.',
        'target_language': 'Urdu'
    }
)

print("Status:", response.status_code)
print("Response:", json.dumps(response.json(), indent=2, ensure_ascii=False))
