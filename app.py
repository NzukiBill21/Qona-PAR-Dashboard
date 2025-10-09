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
    app = Flask(__name__)

    # -------- CORS Whitelist --------
    CORS(
        app,
        resources={r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "http://localhost:3001",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:3001"
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


# ✅ Favicon Route (AFTER app exists)
@app.route('/favicon.ico')
def favicon():
    icon_path = os.path.join(app.root_path, 'static')
    print("[LOG] Favicon requested")  # You'll see this in terminal
    return send_from_directory(
        icon_path,
        'favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8050, debug=True)
