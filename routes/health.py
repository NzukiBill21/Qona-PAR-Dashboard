from flask import Blueprint
from datetime import datetime
from core.response import ok
bp = Blueprint("health", __name__)
@bp.get("/healthz")
def health(): return ok({"time": datetime.utcnow().isoformat()})
