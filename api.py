from flask import Flask, jsonify, Blueprint, request, abort
import config
from scripts import *
from flask_cors import CORS

if __name__ != '__main__':
    CORS(app)

VERSION = "test"

api = Blueprint(
    "api",
    __name__,
    template_folder='templates',
    static_folder='static',
    url_prefix='/api'
)

ALLOWED_API_KEYS = config.API_KEYS

def check_api_key(api_key):
    if api_key not in ALLOWED_API_KEYS:
        abort(401, description="Неверный API ключ")

@api.route('/', methods=['GET'])
def example():
    return jsonify({"message": "API Работает"}), 200


if __name__ == '__main__':
    app = Flask(__name__)
    app.register_blueprint(api)
    app.run(port=5000, debug=True)