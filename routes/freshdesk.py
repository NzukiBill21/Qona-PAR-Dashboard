# routes/freshdesk.py
from flask import Blueprint, jsonify
from adapters.freshdesk_client import summarize_freshdesk

bp = Blueprint("freshdesk", __name__)

@bp.get("/freshdesk_summary")
def get_summary():
    """Return summarized Freshdesk ticket analytics"""
    data = summarize_freshdesk()
    return jsonify(data)
