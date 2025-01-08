from decorators.login_required import authentication_required
from flask import Blueprint, jsonify, request
from runtime import MedicalRecordService

prescription_bp = Blueprint("predict", __name__)


@prescription_bp.route("/record", methods=["GET", "POST"])
def get_record():
    return (
        jsonify(
            {
                "test": "Hello",
            }
        ),
        200,
    )


@prescription_bp.route("/records/<recordId>", methods=["POST"])
def handle_record(recordId):
    return (
        jsonify(
            {
                "test": "Hello",
            }
        ),
        200,
    )
