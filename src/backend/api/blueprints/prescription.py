from decorators.login_required import authentication_required
from flask import Blueprint, jsonify, request
from runtime import PredictionService

prescription_bp = Blueprint("predict", __name__)


@prescription_bp.route("/prescription", methods=["GET", "POST"])
@authentication_required
def get_record():
    return (
        jsonify(
            {
                "test": "Hello",
            }
        ),
        200,
    )


@prescription_bp.route("/prescription", methods=["POST"])
@authentication_required
def get_record():
    return (
        jsonify(
            {
                "test": "Hello",
            }
        ),
        200,
    )
