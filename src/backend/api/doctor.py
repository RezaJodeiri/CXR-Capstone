"""
Author: Nathan Luong
"""

from decorators.login_required import authentication_required
from flask import Blueprint, jsonify, request
from runtime import IdentityProvider

doctor_bp = Blueprint("doctor_bp", __name__)


@doctor_bp.route("/patients", methods=["GET"])
@authentication_required
def get_patients_for_doctor(doctorId):
    try:
        users = IdentityProvider.get_patients_by_doctor_id(doctorId)
        return (
            jsonify(list(users) if users else []),
            200,
        )
    except Exception as e:
        return (
            jsonify({"error": str(e)}),
            500,
        )


@doctor_bp.route("/patient", methods=["POST"])
@authentication_required
def add_patient_for_doctor(doctorId):
    try:
        body = request.get_json()
        user = IdentityProvider.create_patient(
            doctor_id=doctorId,
            patient_email=body["email"],
            patient_detail={
                "gender": body.get("gender", "other"),
                "birthdate": body.get("birthdate", "yyyy-mm-dd"),
                "name": body.get("name", ""),
            },
        )
        return (
            jsonify(user),
            200,
        )
    except Exception as e:
        return (
            jsonify({"error": str(e)}),
            500,
        )
