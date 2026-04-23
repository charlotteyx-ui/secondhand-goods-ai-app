from pathlib import Path
from uuid import uuid4
from fastapi import UploadFile
from app.config import TMP_DIR


def save_upload(file: UploadFile, prefix: str) -> Path:
    suffix = Path(file.filename or "image.jpg").suffix or ".jpg"
    path = TMP_DIR / f"{prefix}_{uuid4().hex}{suffix}"
    with path.open("wb") as f:
        f.write(file.file.read())
    return path