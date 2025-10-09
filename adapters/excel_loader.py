import logging, pandas as pd
from config import settings
log = logging.getLogger("excel")
def load_excel_raw():
    log.info("Loading Excel from %s", settings.INPUT_PATH)
    return pd.read_excel(settings.INPUT_PATH, sheet_name=settings.SHEET_NAME, header=0)
