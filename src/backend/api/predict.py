from decorators.login_required import authentication_required
from flask import Blueprint, jsonify, request
from runtime import PredictionService

predict_bp = Blueprint("predict", __name__)


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@predict_bp.route("/predict", methods=["POST"])
@authentication_required
def upload_image():
    if "image" not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = file.filename
        file_size = len(file.read())
        file.seek(0)

        res = PredictionService.predict(file)

        return (
            jsonify(
                {
                    "model_id": PredictionService.get_current_model(),
                    "prediction": res,
                    "filename": filename,
                    "file_size": file_size,
                    "content_type": file.content_type,
                }
            ),
            200,
        )
    else:
        return jsonify({"message": "Invalid file type"}), 400