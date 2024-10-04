from flask import Flask
from flask_cors import CORS
from api.predict import predict_bp
from runtime.config import Config

app = Flask(__name__)
config = Config()

CORS(
    app,
    resources={
        r"/*": {"origins": [config.get("FRONTEND_URL")]},
    },
)

app.register_blueprint(predict_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
