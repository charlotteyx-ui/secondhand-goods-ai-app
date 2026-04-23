from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
TMP_DIR = BASE_DIR / "tmp"
TMP_DIR.mkdir(parents=True, exist_ok=True)

PUBLIC_BASE_URL = "http://localhost:8000"