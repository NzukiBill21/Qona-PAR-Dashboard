import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# === Fallback Excel ===
INPUT_PATH = os.getenv("INPUT_PATH", "Data.xlsx")
SHEET_NAME = os.getenv("SHEET_NAME", "Classification ")

# === Freshsales Config ===
USE_FRESHSALES = os.getenv("USE_FRESHSALES", "false").lower() == "true"
FRESHSALES_API_KEY = os.getenv("FRESHSALES_API_KEY")
FRESHSALES_DOMAIN = os.getenv("FRESHSALES_DOMAIN")

# === Freshdesk Config ===
USE_FRESHDESK = os.getenv("USE_FRESHDESK", "false").lower() == "true"
FRESHDESK_API_KEY = os.getenv("FRESHDESK_API_KEY")
FRESHDESK_DOMAIN = os.getenv("FRESHDESK_DOMAIN")
