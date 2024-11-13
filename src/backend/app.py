from flask import Flask
from flask_cors import CORS

from api.oauth import oauth_bp
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
app.register_blueprint(oauth_bp, url_prefix="/oauth")

print(app.url_map)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
