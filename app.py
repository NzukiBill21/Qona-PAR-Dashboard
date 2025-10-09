import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from logging.config import dictConfig

# ---------- App Factory ----------
def create_app():
    load_dotenv()

    dictConfig({
        "version": 1,
        "formatters": {
            "default": {
                "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
            }
        },
        "handlers": {
            "wsgi": {
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
                "formatter": "default"
            }
        },
        "root": {"level": os.getenv("LOG_LEVEL", "INFO"), "handlers": ["wsgi"]}
    })

    # Detect absolute path to the build folder
    build_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Frontend", "build")

    app = Flask(
        __name__,
        static_folder=build_path,
        static_url_path=""
    )

    CORS(app, resources={r"/*": {"origins": "*"}})

    # Health check for Render logs
    @app.route("/api/info")
    def api_info():
        return jsonify({
            "name": "PAR Enterprise Backend",
            "version": "v1.3.0",
            "environment": os.getenv("FLASK_ENV", "production"),
            "status": "online",
            "build_path": build_path,
            "exists": os.path.exists(build_path)
        })

    # Register blueprints
    from routes.health import bp as health_bp
    from routes.metrics import bp as metrics_bp
    from routes.export import bp as export_bp
    from scheduler.jobs import maybe_start_scheduler

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(metrics_bp, url_prefix="/api")
    app.register_blueprint(export_bp, url_prefix="/api")

    maybe_start_scheduler(app)

    return app

# ---------- Create App ----------
app = create_app()

# ---------- Serve Frontend ----------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    react_dir = os.path.join(app.root_path, "Frontend", "build")
    target = os.path.join(react_dir, path)

    # Log where it’s looking
    print(f"[DEBUG] Serving from: {react_dir}")
    print(f"[DEBUG] Requested path: {path}")

    if path and os.path.exists(target):
        return send_from_directory(react_dir, path)
    return send_from_directory(react_dir, "index.html")

# ---------- Favicon ----------
@app.route("/favicon.ico")
def favicon():
    icon_path = os.path.join(app.root_path, "static")
    return send_from_directory(icon_path, "favicon.ico", mimetype="image/vnd.microsoft.icon")

# ---------- Entry ----------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
