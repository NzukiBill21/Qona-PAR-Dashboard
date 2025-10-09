# routes/metrics.py
from flask import Blueprint, request
from core.response import ok
from services.data_service import (
    get_overall_and_weeks,
    get_officer_series,
    filter_payload_by_week,
)

bp = Blueprint("metrics", __name__)

# ==========================================================
#                     OVERALL PORTFOLIO
# ==========================================================
@bp.get("/overall")
def overall():
    """
    Returns overall portfolio analytics data.
    Supports ?date=YYYY-MM-DD&mode=single|upto (defaults to 'single')
    """
    date_str = request.args.get("date")  # e.g. 2025-09-20
    mode = (request.args.get("mode") or "single").lower().strip()

    data = get_overall_and_weeks()

    if date_str:
        try:
            # 🔒 Force exact match so calendar == snapshot
            data = filter_payload_by_week(data, date_str, mode)
        except Exception as e:
            print(f"Date filter error (overall): {e}")

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
    date_str = request.args.get("date")
    mode = (request.args.get("mode") or "single").lower().strip()

    data = get_officer_series(name)

    if date_str:
        try:
            # 🔒 Match same date context as /overall for consistency
            data = filter_payload_by_week(data, date_str, mode)
        except Exception as e:
            print(f"Date filter error (officer): {e}")

    return ok(data)
