from api.oauth import oauth_bp
from api.predict import predict_bp
from flask import Flask
from flask_cors import CORS
from runtime import RuntimeConfig

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/*": {"origins": [RuntimeConfig.get("FRONTEND_URL")]},
    },
)

app.register_blueprint(predict_bp)
app.register_blueprint(oauth_bp, url_prefix="/oauth")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
