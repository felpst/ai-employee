from flask import Flask
from .routes import tools_blueprint


def create_app():
    app = Flask(__name__)

    app.register_blueprint(tools_blueprint)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=8585)
