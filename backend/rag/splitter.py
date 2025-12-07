from typing import List, Dict
import re

def split_text_into_chunks(document: Dict, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[Dict]:
    """
    Splits a document's content into smaller chunks.
    Aims for paragraph-level splitting first, then character-level if paragraphs are too long.
    Adds metadata to each chunk.
    """
    content = document['content']
    metadata = document['metadata']
    chunks = []

    # Attempt to split by paragraphs first
    paragraphs = re.split(r'\n\s*\n', content)
    
    current_chunk = ""
    current_chunk_length = 0

    for paragraph in paragraphs:
        # If adding the next paragraph exceeds chunk_size, finalize current_chunk
        if current_chunk_length + len(paragraph) + 2 > chunk_size: # +2 for newline
            if current_chunk:
                chunks.append({
                    "content": current_chunk.strip(),
                    "metadata": {**metadata, "chunk_id": len(chunks)}}
                )
                # Start new chunk with overlap
                current_chunk = current_chunk[-chunk_overlap:] + "\n\n" + paragraph
                current_chunk_length = len(current_chunk)
            else: # Single paragraph is longer than chunk_size
                # Fallback to character-level splitting for very long paragraphs
                for i in range(0, len(paragraph), chunk_size - chunk_overlap):
                    sub_chunk = paragraph[i:i + chunk_size]
                    chunks.append({
                        "content": sub_chunk.strip(),
                        "metadata": {**metadata, "chunk_id": len(chunks)}}
                    )
                current_chunk = paragraph[-(chunk_overlap):] # Keep overlap for next iteration
                current_chunk_length = len(current_chunk)
        else:
            if current_chunk:
                current_chunk += "\n\n" + paragraph
            else:
                current_chunk = paragraph
            current_chunk_length = len(current_chunk)

    if current_chunk:
        chunks.append({
            "content": current_chunk.strip(),
            "metadata": {**metadata, "chunk_id": len(chunks)}}
        )

    return chunks

if __name__ == "__main__":
    # Example usage
    sample_document = {
        "content": """
        This is the first paragraph of a sample document. It contains some text that will be split.

        This is the second paragraph. It's a bit longer than the first one. We need to make sure that the splitter handles different lengths correctly.

        This is the third and potentially very long paragraph. It could even be longer than the chunk size,
        which would force the splitter to break it down further, potentially at arbitrary points.
        This demonstrates the robust handling of various text lengths and structures.
        We are testing the overlap functionality as well to ensure continuity.
        """,
        "metadata": {"source": "sample_file.md"}
    }

    # Test with default chunk_size and chunk_overlap
    print("--- Default Split ---")
    chunks = split_text_into_chunks(sample_document)
    for i, chunk in enumerate(chunks):
        print(f"Chunk {i+1} (Source: {chunk['metadata']['source']}):\n{chunk['content']}\n---")

    # Test with smaller chunk_size
    print("\n--- Smaller Chunk Size Split (chunk_size=100) ---")
    chunks_small = split_text_into_chunks(sample_document, chunk_size=100, chunk_overlap=20)
    for i, chunk in enumerate(chunks_small):
        print(f"Chunk {i+1} (Source: {chunk['metadata']['source']}):\n{chunk['content']}\n---")
