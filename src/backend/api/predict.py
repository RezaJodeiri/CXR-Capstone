import numpy as np
from io import BytesIO
from pydicom import dcmread
from PIL import Image
from decorators.login_required import authentication_required
from flask import Blueprint, jsonify, request, send_file
from runtime import PredictionService

predict_bp = Blueprint("predict", __name__)


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "dcm"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@predict_bp.route("/predict", methods=["POST"])
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
                    "predictions": res.get("predictions", {}),
                    "metadata": res.get("metadata", None),
                    "filename": filename,
                    "file_size": file_size,
                    "content_type": file.content_type,
                }
            ),
            200,
        )
    else:
        return jsonify({"message": "Invalid file type"}), 400

@predict_bp.route("/processDCMimg", methods=["POST"])
def processDCMimg():
    file = request.files.get('file')
    
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        dicom_file = dcmread(file)
        dicom_image = dicom_file.pixel_array
        img = Image.fromarray(dicom_image[0].astype(np.uint8)) if len(dicom_image.shape) > 2 else Image.fromarray(dicom_image.astype(np.uint8))
        png_io = BytesIO()
        img.save(png_io, format='PNG')
        png_io.seek(0)
        return send_file(png_io, mimetype='image/png', as_attachment=False)

    except Exception as e:
        return jsonify({"error": str(e)}), 500