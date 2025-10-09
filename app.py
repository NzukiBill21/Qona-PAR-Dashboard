import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from logging.config import dictConfig


def create_app():
    # -------- Load .env variables --------
    load_dotenv()

    # -------- Logging Configuration --------
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
                "formatter": "default",
            }
        },
        "root": {
            "level": os.getenv("LOG_LEVEL", "INFO"),
            "handlers": ["wsgi"],
        },
    })

    # -------- Flask Application Setup --------
    app = Flask(
        __name__,
        static_folder=os.path.join(os.path.dirname(__file__), "Frontend", "dist"),  # or "build" for React
        static_url_path=""
    )

    # -------- CORS Whitelist --------
    CORS(
        app,
        resources={r"/api/*": {
            "origins": [
                "*"
            ]
        }},
        supports_credentials=True
    )

    # -------- API Info Endpoint --------
    @app.get("/api/info")
    def api_info():
        return {
            "name": "PAR Enterprise Backend",
            "version": "v1.3.0",
            "environment": os.getenv("FLASK_ENV", "development"),
            "status": "online"
        }

    # -------- Register Blueprints --------
    from routes.health import bp as health_bp
    from routes.metrics import bp as metrics_bp
    from routes.export import bp as export_bp

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(metrics_bp, url_prefix="/api")
    app.register_blueprint(export_bp, url_prefix="/api")

    # -------- Optional Background Scheduler --------
    from scheduler.jobs import maybe_start_scheduler
    maybe_start_scheduler(app)

    return app


# -------- Entry Point --------
app = create_app()


# ✅ Serve Frontend (React/Vue build)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    frontend_dir = os.path.join(app.root_path, "Frontend", "dist")  # or "build"
    if path != "" and os.path.exists(os.path.join(frontend_dir, path)):
        return send_from_directory(frontend_dir, path)
    else:
        return send_from_directory(frontend_dir, "index.html")


# ✅ Favicon Route
@app.route('/favicon.ico')
def favicon():
    icon_path = os.path.join(app.root_path, 'static')
    return send_from_directory(icon_path, 'favicon.ico', mimetype='image/vnd.microsoft.icon')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
