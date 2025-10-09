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
            "default": {"format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"}
        },
        "handlers": {
            "wsgi": {
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
                "formatter": "default",
            }
        },
        "root": {"level": os.getenv("LOG_LEVEL", "INFO"), "handlers": ["wsgi"]},
    })

    app = Flask(
        __name__,
        static_folder=os.path.join(os.path.dirname(__file__), "Frontend", "build"),
        static_url_path="/",
    )

    # --- CORS fix ---
    CORS(app, supports_credentials=True, origins="*")

    # --- Health check ---
    @app.route("/api/info")
    def info():
        return jsonify({
            "app": "Qona PAR Dashboard",
            "status": "online",
            "env": os.getenv("FLASK_ENV", "production"),
        })

    # --- Blueprints ---
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


# ---------- Serve React Frontend ----------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    react_dir = os.path.join(app.root_path, "Frontend", "build")
    if path != "" and os.path.exists(os.path.join(react_dir, path)):
        return send_from_directory(react_dir, path)
    return send_from_directory(react_dir, "index.html")


# ---------- Main Entry ----------
if __name__ == "__main__":
    # Detect Railway or local port automatically
    port = int(os.environ.get("PORT", 10000))
    host = "0.0.0.0"

    print(f"🚀 Running Flask on {host}:{port}")
    app.run(host=host, port=port)
