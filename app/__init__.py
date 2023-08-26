from flask import Flask
from flask_cors import CORS
from app.extensions import db
from app.api.views import crud_bp


def create_app():
    app = Flask(__name__)
    CORS(app)
    # Change to the appropriate config file
    app.config.from_object('config.development')

    # CORS(app)
    db.init_app(app)

    app.register_blueprint(crud_bp, url_prefix='/crud')

    return app
