# services/data_service.py
import os
from typing import List, Dict
import pandas as pd
from datetime import datetime
import re

from adapters.excel_loader import load_excel_raw
# from adapters.freshsales_client import fetch_dataframe  # ⛔ Disabled for now
# from adapters.freshdesk_client import fetch_freshdesk_tickets  # ⛔ Only needed for API testing
from config import settings
from parsing.classification_parser import (
    load_ctx,
    latest_snapshot,
    overall_weeks,
    officers as parse_officers,
    officer_weeks,
)

# ---------- DATA LOADER ----------
def _load_df() -> pd.DataFrame:
    """TEMP: Always use Excel source for PAR analytics."""
    try:
        print(f"📁 Loading Excel from {settings.INPUT_PATH}")
        df = load_excel_raw()
        print(f"✅ Excel loaded successfully: {len(df)} rows")
        return df
    except FileNotFoundError as e:
        print(f"❌ Excel file not found: {settings.INPUT_PATH}")
        print(f"❌ Current directory: {os.getcwd()}")
        print(f"❌ Files in directory: {os.listdir('.')}")
        raise
    except Exception as e:
        print(f"❌ Excel loading error: {e}")
        raise



def _dedup_officers(names: List[str]) -> List[str]:
    norm = []
    seen = set()
    for n in names:
        t = (n or "").strip().title()
        if not t or t in seen:
            continue
        seen.add(t)
        norm.append(t)
    return norm

def _auto_parse_date(date_str: str) -> str:
    """
    Accepts '31 Aug', '5 Sep', '12 Sept', '2025-09-12' etc. -> 'YYYY-MM-DD'.
    Defaults year to current year if not provided.
    """
    if not date_str:
        return ""

    s = str(date_str).strip()
    # Already ISO?
    try:
        _ = datetime.strptime(s, "%Y-%m-%d")
        return s
    except Exception:
        pass

    # Allow Aug/Sep/Sept/Oct forms, add current year
    m = re.match(r"^\s*(\d{1,2})\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s*(\d{4})?\s*$", s, re.I)
    if m:
        day, mon, year = m.groups()
        mon = mon[:3].title()  # Sept -> Sep
        if not year:
            year = str(datetime.now().year)
        try:
            d = datetime.strptime(f"{day} {mon} {year}", "%d %b %Y")
            return d.strftime("%Y-%m-%d")
        except Exception:
            return ""
    return ""

# ---------- PUBLIC ----------
def get_overall_and_weeks() -> Dict:
    """
    Returns:
    {
      "snapshot": {...},
      "weekly": [...],
      "officers": [...]
    }
    """
    df = _load_df()
    if df is None or df.empty:
        return {
            "snapshot": {"week": None, "totalOutstanding": 0, "totalGrossProvision": 0, "overallPAR": 0, "lastUpdated": None},
            "weekly": [],
            "officers": [],
        }

    ctx = load_ctx(df)
    offs = _dedup_officers(parse_officers(ctx))
    return {
        "snapshot": latest_snapshot(ctx),
        "weekly": overall_weeks(ctx),
        "officers": offs,
    }

def get_officer_series(name: str) -> Dict:
    """
    Same shape as get_overall_and_weeks() but for a single officer.
    """
    df = _load_df()
    if df is None or df.empty:
        return {
            "snapshot": {"week": None, "totalOutstanding": 0, "totalGrossProvision": 0, "overallPAR": 0, "lastUpdated": None},
            "weekly": [],
            "officers": [],
        }

    ctx = load_ctx(df)
    offs = _dedup_officers(parse_officers(ctx))
    chosen = (name or "").strip()
    return {
        "snapshot": latest_snapshot(ctx, chosen if chosen else None),
        "weekly": officer_weeks(ctx, chosen) if chosen else overall_weeks(ctx),
        "officers": offs,
    }

def filter_payload_by_week(data: Dict, date_str: str, mode: str = "upto") -> Dict:
    """
    Filters 'weekly' up to (<=) or exactly on a given date (handles '5 Sep' too).
    Ensures snapshot = last available in filtered set.
    """
    if not data or "weekly" not in data or not date_str:
        return data

    try:
        iso = _auto_parse_date(date_str)
        if not iso:
            return data

        target = datetime.strptime(iso, "%Y-%m-%d")
        weeks = data.get("weekly", [])

        def _to_dt(w):
            try:
                return datetime.strptime(w["week"], "%Y-%m-%d")
            except Exception:
                # If week is like "5 Sep", attempt parse
                alt = _auto_parse_date(w["week"])
                return datetime.strptime(alt, "%Y-%m-%d") if alt else None

        stamped = [(w, _to_dt(w)) for w in weeks]
        stamped = [(w, d) if d else (w, None) for (w, d) in stamped]
        stamped = [t for t in stamped if t[1] is not None]

        if mode == "single":
            filtered = [w for (w, d) in stamped if d == target]
            # If no exact match, fallback to last <= target
            if not filtered:
                filtered = [w for (w, d) in stamped if d <= target]
                filtered.sort(key=lambda w: datetime.strptime(_auto_parse_date(w["week"]), "%Y-%m-%d"))
        else:
            filtered = [w for (w, d) in stamped if d <= target]
            filtered.sort(key=lambda w: datetime.strptime(_auto_parse_date(w["week"]), "%Y-%m-%d"))

        data["weekly"] = filtered

        if filtered:
            last = filtered[-1]
            data["snapshot"] = {
                "week": _auto_parse_date(last["week"]) or last["week"],
                "totalOutstanding": last.get("outstanding", 0),
                "totalGrossProvision": last.get("provision", 0),
                "overallPAR": last.get("par", 0),
            }
        return data
    except Exception as e:
        print(f"filter_payload_by_week error: {e}")
        return data
