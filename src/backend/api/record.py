from decorators.login_required import authentication_required
from flask import Blueprint, jsonify, request
from runtime import MedicalRecordService, MedicalPrescriptionService


record_blueprint = Blueprint("record", __name__)


@record_blueprint.route("/records", methods=["GET"])
@authentication_required
def paginated_records_by_userId(userId):
    limit = request.args.get("limit", default=10, type=int)
    cursor = request.args.get("cursor", default=None, type=str)
    if cursor == "null":
        cursor = None

    records = MedicalRecordService.get_paginated_record_by_userId(userId, limit, cursor)
    return (
        jsonify(records),
        200,
    )


@record_blueprint.route("/records/<recordId>", methods=["GET", "POST"])
@authentication_required
def handle_record_by_id(userId, recordId):
    if request.method == "GET":
        record = MedicalRecordService.get_record_by_id(recordId)
        prescriptions = (
            MedicalPrescriptionService.get_paginated_prescription_by_recordId(
                recordId, 10
            )
        )

        record["prescription"] = prescriptions
        return (
            jsonify(record),
            200,
        )
    elif request.method == "POST":
        record = {
            "imageUrl": request.json.get("imageUrl", ""),
            "note": request.json.get("note", ""),
            "prescription": request.json.get("prescription", []),
        }
        updated_record = MedicalRecordService.update_record_by_id(recordId, record)
        return (
            jsonify(updated_record),
            200,
        )


@record_blueprint.route("/record", methods=["POST"])
@authentication_required
def create_new_record(userId):
    # When create a new record, check for a valid downloadable picture from the image URL. Then run the disease report on it
    # TODO
    record_info = {
        "imageUrl": request.json.get("imageUrl", ""),
        "note": request.json.get("note", ""),
        "prescription": request.json.get("prescription", []),
    }
    record = MedicalRecordService.create_new_record(userId, record_info)
    return (
        jsonify(record),
        200,
    )
