from decorators.login_required import authentication_required
from flask import Blueprint, jsonify, request
from runtime import MedicalRecordService, MedicalPrescriptionService
from runtime import ReportGenerationService, PredictionService

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
        if not record:
            return (
                jsonify({}),
                404,
            )
        prescriptions = (
            MedicalPrescriptionService.get_paginated_prescription_by_recordId(
                recordId, 10
            )
        )
        record["prescriptions"] = prescriptions
        return (
            jsonify(record),
            200,
        )
    elif request.method == "POST":
        record = {
            "xRayUrl": request.json.get("xRayUrl", ""),
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
    record_info = {
        "xRayUrl": request.json.get("xRayUrl", ""),
        "note": request.json.get("note", ""),
        "priority": request.json.get("priority", ""),
        "report": request.json.get("report", ""),
        "treatmentPlan": request.json.get("treatmentPlan", ""),
    }
    newRecord = MedicalRecordService.create_new_record(userId, record_info)
    return (
        jsonify(newRecord),
        200,
    )


@record_blueprint.route("/records/prediction", methods=["POST"])
@authentication_required
def generate_prediction_and_report(userId):
    xRayUrl = request.json.get("xRayUrl", "")
    (report, prediction) = ReportGenerationService.generate_report(userId, xRayUrl)
    (findings, impression) = report
    return (
        jsonify(
            {
                "report": {"findings": findings, "impression": impression},
                "predictions": prediction["predictions"],
            }
        ),
        200,
    )

@record_blueprint.route("/records/segments", methods=["POST"])
@authentication_required
def generate_segments_from_xray(userId):
    xRayUrl = request.json.get("xRayUrl", "")
    segmented_image_url = PredictionService.segment_from_url(xRayUrl)

    return (
        jsonify({"segment": segmented_image_url}),
        200,
    )

@record_blueprint.route("/records/segmentation-boxes", methods=["POST"])
@authentication_required
def generate_segment_boxes_from_xray(userId):
    xRayUrl = request.json.get("xRayUrl", "")
    res = PredictionService.segment_boxes_from_url(xRayUrl)

    return (
        jsonify(res),
        200,
    )
