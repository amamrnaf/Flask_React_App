from flask import Flask
from flask_cors import CORS
from app.extensions import db
from app.api.views import crud_bp,auth,admin_bp
from flask_jwt_extended import JWTManager


def create_app():
    app = Flask(__name__)
    CORS(app)
    # Change to the appropriate config file
    app.config.from_object('config.development')
    jwt = JWTManager(app)
    
    
    db.init_app(app)

    app.register_blueprint(crud_bp, url_prefix='/crud')
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(admin_bp, url_prefix='/admin')

    return app
