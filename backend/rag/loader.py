import os
import glob
from typing import List, Dict

def load_markdown_documents(docs_dir: str = "physical-ai-book/docs") -> List[Dict]:
    """
    Loads all markdown and mdx files from the specified directory and its subdirectories.
    Returns a list of dictionaries, where each dictionary contains 'content' and 'metadata'.
    """
    documents = []
    # Using glob to find all markdown and mdx files recursively
    markdown_files = glob.glob(os.path.join(docs_dir, '**', '*.md'), recursive=True)
    markdown_files.extend(glob.glob(os.path.join(docs_dir, '**', '*.mdx'), recursive=True))

    for file_path in markdown_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract metadata (e.g., file path as source)
            relative_path = os.path.relpath(file_path, docs_dir)
            metadata = {"source": relative_path}
            
            documents.append({"content": content, "metadata": metadata})
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
            continue
    return documents

if __name__ == "__main__":
    # Example usage
    docs = load_markdown_documents()
    print(f"Loaded {len(docs)} documents.")
    if docs:
        print("\nFirst document content (first 200 chars):")
        print(docs[0]['content'][:200])
        print("\nFirst document metadata:")
        print(docs[0]['metadata'])
