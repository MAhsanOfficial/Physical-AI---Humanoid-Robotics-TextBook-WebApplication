import os
import sys

def check_config():
    env_path = ".env"
    
    # Check if .env exists
    if not os.path.exists(env_path):
        print(f"[WARNING] .env file not found at {os.path.abspath(env_path)}")
        create_new = input("Do you want to create it now? (y/n): ")
        if create_new.lower() == 'y':
            with open(env_path, 'w') as f:
                f.write("")
        else:
            print("[ERROR] Cannot proceed without .env file.")
            sys.exit(1)

    # Read .env manually to check for keys (load_dotenv isn't enough if we want to write back)
    config = {}
    with open(env_path, 'r') as f:
        for line in f:
            if '=' in line:
                key, val = line.strip().split('=', 1)
                config[key.strip()] = val.strip()

    # Check OPENAI_API_KEY
    if 'OPENAI_API_KEY' not in config or not config['OPENAI_API_KEY'] or config['OPENAI_API_KEY'] == 'sk-proj-YourKeyHere':
        print("\n[ERROR] OPENAI_API_KEY is missing or invalid in .env")
        print("You need an OpenAI API Key for the chatbot to work.")
        new_key = input("Please paste your OpenAI API Key (sk-...): ").strip()
        
        if new_key:
            config['OPENAI_API_KEY'] = new_key
            # Write back to .env
            with open(env_path, 'w') as f:
                for k, v in config.items():
                    f.write(f"{k}={v}\n")
            print("[SUCCESS] API Key saved to .env")
        else:
            print("[ERROR] No key provided. Exiting.")
            sys.exit(1)
    else:
        print("[SUCCESS] OPENAI_API_KEY found.")

if __name__ == "__main__":
    try:
        check_config()
    except KeyboardInterrupt:
        sys.exit(1)
    except Exception as e:
        print(f"[ERROR] Config check failed: {e}")
        # Don't block startup if check crashes, but warn
