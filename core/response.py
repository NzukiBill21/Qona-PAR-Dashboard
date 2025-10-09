from flask import jsonify
def ok(data=None, message="ok"): return jsonify({"status": True, "message": message, "data": data or {}})
def fail(message="error", data=None, code=400):
    resp = jsonify({"status": False, "message": message, "data": data or {}}); return (resp, code)
