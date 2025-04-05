"""
Author: Nathan Luong, Ayman Akhras, Kelly Deng
"""

from flask import Flask, json, make_response, request
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from runtime import RuntimeConfig

from api.oauth import oauth_bp
from api.user import user_blueprint
from api.record import record_blueprint
from api.prescription import prescription_blueprint
from api.fileHandler import s3_blueprint
from api.doctor import doctor_bp
from api.healthCheck import health_check_bp

ALLOWED_ORIGINS = [
    RuntimeConfig.get("FRONTEND_URL"),
    "http://www.neuralanalyzer.ca",
    "https://www.neuralanalyzer.ca"
]

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {"origins": ALLOWED_ORIGINS},
    },
)

app.register_blueprint(health_check_bp)
app.register_blueprint(oauth_bp, url_prefix="/oauth")
app.register_blueprint(user_blueprint, url_prefix="/users")
app.register_blueprint(record_blueprint, url_prefix="/users/<userId>")
app.register_blueprint(doctor_bp, url_prefix="/doctors/<doctorId>")
app.register_blueprint(prescription_blueprint, url_prefix="/users/<userId>/records/<recordId>")
app.register_blueprint(s3_blueprint)



@app.before_request
def handle_options_request():    
    if request.method == "OPTIONS":
        response = make_response({}, 200)
        response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
        response.headers.add('Access-Control-Allow-Methods', "GET,POST,PUT,DELETE,OPTIONS")
        response.headers.add('Access-Control-Allow-Credentials', "true")
        return response
    
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

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
