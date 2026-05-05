import uuid
from typing import Dict

# Simple in-memory store mapping file_id to extracted text
file_store: Dict[str, str] = {}

def add_file(text: str) -> str:
    file_id = str(uuid.uuid4())
    file_store[file_id] = text
    return file_id

def get_file(file_id: str) -> str | None:
    return file_store.get(file_id)
