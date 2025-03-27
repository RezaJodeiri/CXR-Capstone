from flask import Flask, json
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from runtime import RuntimeConfig

from api.oauth import oauth_bp
from api.user import user_blueprint
from api.record import record_blueprint
from api.prescription import prescription_blueprint
from api.fileHandler import s3_blueprint
from api.doctor import doctor_bp

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {"origins": [RuntimeConfig.get("FRONTEND_URL")]},
    },
)

app.register_blueprint(oauth_bp, url_prefix="/oauth")
app.register_blueprint(user_blueprint, url_prefix="/users")
app.register_blueprint(record_blueprint, url_prefix="/users/<userId>")
app.register_blueprint(doctor_bp, url_prefix="/doctors/<doctorId>")
app.register_blueprint(prescription_blueprint, url_prefix="/users/<userId>/records/<recordId>")
app.register_blueprint(s3_blueprint)


@app.errorhandler(HTTPException)
def handle_exception(e):
    """Return JSON instead of HTML for HTTP errors."""
    # start with the correct headers and status code from the error
    response = e.get_response()
    # replace the body with JSON
    response.data = json.dumps(
        {
            "code": e.code,
            "name": e.name,
            "description": e.description,
        }
    )
    response.content_type = "application/json"
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
