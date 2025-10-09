import logging
import requests
import pandas as pd
from config import settings

log = logging.getLogger("freshdesk")

# =====================================
#   FRESHDESK DATA FETCHER (SMART)
# =====================================

def _auth_headers():
    if not settings.FRESHDESK_API_KEY or not settings.FRESHDESK_DOMAIN:
        raise RuntimeError("Missing Freshdesk credentials in settings.py")

    return {
        "Authorization": f"{settings.FRESHDESK_API_KEY}:X",
        "Content-Type": "application/json",
    }


def _get_json(endpoint: str):
    """Generic GET helper that returns parsed JSON or []"""
    url = f"https://{settings.FRESHDESK_DOMAIN}/api/v2/{endpoint}"
    headers = _auth_headers()

    log.info(f"Fetching {endpoint} ...")
    r = requests.get(url, headers=headers, auth=(settings.FRESHDESK_API_KEY, "X"), timeout=30)

    if not r.ok:
        log.error(f"❌ {endpoint} → {r.status_code} | {r.text[:200]}")
        return []
    try:
        return r.json()
    except Exception:
        log.warning(f"{endpoint}: Non-JSON response")
        return []


# =====================================
#   DATAFRAME FETCHING
# =====================================

def fetch_freshdesk_tickets() -> pd.DataFrame:
    """Pulls latest tickets and merges with agents & companies if available"""
    tickets = _get_json("tickets")
    agents = _get_json("agents")
    companies = _get_json("companies")

    df_tickets = pd.DataFrame(tickets or [])
    df_agents = pd.DataFrame(agents or [])
    df_companies = pd.DataFrame(companies or [])

    if df_tickets.empty:
        log.warning("⚠️ No tickets found in Freshdesk.")
        return pd.DataFrame()

    # Normalize
    df_tickets["created_at"] = pd.to_datetime(df_tickets.get("created_at"))
    df_tickets["updated_at"] = pd.to_datetime(df_tickets.get("updated_at"))

    # Merge agent info
    if not df_agents.empty and "id" in df_agents.columns:
        df_agents = df_agents.rename(columns={"id": "agent_id", "contact": "agent_contact"})
        df_tickets = df_tickets.merge(df_agents[["agent_id", "contact", "email", "available", "occasional"]], 
                                      how="left", left_on="responder_id", right_on="agent_id")

    # Merge company info
    if not df_companies.empty and "id" in df_companies.columns:
        df_companies = df_companies.rename(columns={"id": "company_id", "name": "company_name"})
        df_tickets = df_tickets.merge(df_companies[["company_id", "company_name"]], how="left", on="company_id")

    log.info(f"✅ Loaded {len(df_tickets)} tickets from Freshdesk")
    return df_tickets


# =====================================
#   ANALYTICAL SUMMARY
# =====================================

def summarize_freshdesk() -> dict:
    """Summarize key metrics for dashboard consumption."""
    df = fetch_freshdesk_tickets()
    if df.empty:
        return {"error": "No tickets available"}

    summary = {
        "total_tickets": len(df),
        "open_tickets": int((df["status"] == 2).sum()) if "status" in df.columns else 0,
        "pending_tickets": int((df["status"] == 3).sum()) if "status" in df.columns else 0,
        "resolved_tickets": int((df["status"] == 4).sum()) if "status" in df.columns else 0,
        "closed_tickets": int((df["status"] == 5).sum()) if "status" in df.columns else 0,
        "avg_sentiment": float(df["initial_sentiment_score"].mean()) if "initial_sentiment_score" in df.columns else None,
        "tickets_by_priority": df["priority"].value_counts().to_dict() if "priority" in df.columns else {},
        "tickets_by_company": df["company_name"].value_counts().to_dict() if "company_name" in df.columns else {},
        "recent_tickets": df.sort_values("created_at", ascending=False)
                              .head(5)
                              .to_dict(orient="records"),
    }

    return summary
