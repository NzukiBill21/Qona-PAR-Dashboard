# routes/metrics.py
from flask import Blueprint, request
from core.response import ok
from services.data_service import (
    get_overall_and_weeks,
    get_officer_series,
    filter_payload_by_week,
)

bp = Blueprint("metrics", __name__)

def _arg_date_and_mode():
    """
    Extract a safe YYYY-MM-DD (local) date and mode.
    Frontend now always sends a local ISO date (no TZ).
    """
    date_str = (request.args.get("date") or request.args.get("week") or "").strip()
    mode = (request.args.get("mode") or "single").strip().lower()
    if mode not in ("single", "upto"):
        mode = "single"
    return date_str, mode

# ==========================================================
#                     OVERALL PORTFOLIO
# ==========================================================
@bp.get("/overall")
def overall():
    """
    Returns overall portfolio analytics data.
    Supports ?date=YYYY-MM-DD&mode=single|upto
    """
    date_str, mode = _arg_date_and_mode()
    data = get_overall_and_weeks()

    if date_str:
        try:
            # exact date match or upto, handled in data_service
            data = filter_payload_by_week(data, date_str, mode)
        except Exception as e:
            print(f"[overall] date filter error: {e}")

    return ok(data)

# ==========================================================
#                     OFFICER METRICS
# ==========================================================
@bp.get("/officer")
def officer():
    """
    Returns officer-specific analytics data.
    Supports ?name=<officer>&date=YYYY-MM-DD&mode=single|upto
    """
    name = (request.args.get("name") or request.args.get("officer") or "").strip()
    date_str, mode = _arg_date_and_mode()

    data = get_officer_series(name)

    if date_str:
        try:
            data = filter_payload_by_week(data, date_str, mode)
        except Exception as e:
            print(f"[officer] date filter error: {e}")

    return ok(data)
