import io
import logging
import pydicom

from PIL import Image
from flask import Blueprint, Flask, jsonify, request, send_file
from models.Detr.detr_api import image_segmentation, get_boxes
from models.classification.classification_api import predict_classification

app = Flask(__name__)

predict_bp = Blueprint("predict", __name__)
segment_bp = Blueprint("segment", __name__)

RESET = "\033[0m"
COLORS = {
    "DEBUG": "\033[36m",  # Cyan
    "INFO": "\033[32m",  # Green
    "WARNING": "\033[33m",  # Yellow
    "ERROR": "\033[31m",  # Red
    "CRITICAL": "\033[1;31m",  # Bold Red
}


class ColorFormatter(logging.Formatter):
    def format(self, record):
        log_color = COLORS.get(record.levelname, RESET)
        record.levelname = f"{log_color}{record.levelname}{RESET}"
        record.msg = f"{log_color}{record.msg}{RESET}"
        return super().format(record)


console_handler = logging.StreamHandler()
console_handler.setFormatter(
    ColorFormatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
)
logger = logging.getLogger(__name__)
logger.addHandler(console_handler)
logger.setLevel(logging.INFO)

def process_dicom(file_content):
    """Process DICOM file and extract image and metadata"""
    try:
        dcm = pydicom.dcmread(io.BytesIO(file_content))

        def safe_convert(value):
            """Safely convert DICOM values to JSON serializable format"""
            if hasattr(value, 'original_string'):
                return str(value.original_string)
            if hasattr(value, 'value'):
                if isinstance(value.value, list):
                    return [str(x) for x in value.value]
                return str(value.value)
            if isinstance(value, pydicom.multival.MultiValue):
                return [str(x) for x in value]
            return str(value)

        # Extract metadata with safe conversion
        metadata = {
            "study_id": safe_convert(getattr(dcm, "StudyID", "Unknown")),
            "patient_id": safe_convert(getattr(dcm, "PatientID", "Unknown")),
            "patient_name": safe_convert(getattr(dcm, "PatientName", "Unknown")),
            "patient_sex": safe_convert(getattr(dcm, "PatientSex", "Unknown")),
            "acquisition_date": safe_convert(getattr(dcm, "AcquisitionDate", "Unknown")),
            "view_position": safe_convert(getattr(dcm, "ViewPosition", "Unknown")),
            "patient_orientation": safe_convert(getattr(dcm, "PatientOrientation", "Unknown")),
        }

        # Convert DICOM image to binary directly
        img = dcm.pixel_array
        img_pil = Image.fromarray(img)
        img_byte_arr = io.BytesIO()
        img_pil.save(img_byte_arr, format='JPEG')
        img_byte_arr.seek(0)

        return img_byte_arr, metadata, True
    except Exception as e:
        logger.error(f"Error processing DICOM: {str(e)}")
        return file_content, None, False

@predict_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200


@predict_bp.route("/predict", methods=["POST"])
def predict():
    try:
        if "file" not in request.files:
            logger.warning("No file found in the request.")
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        file_content = file.read()

        img, metadata, is_dicom = process_dicom(file_content)

        if not is_dicom:
            file.seek(0)
            metadata = None
            logger.info("Processing as regular image")
        else:
            logger.info("Processing as DICOM image")

        response = {"predictions": predict_classification(img)}
        if metadata:
            response["metadata"] = metadata

        logger.info(f"Predictions complete: {response}")
        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@predict_bp.route("/segments", methods=["POST"])
def segments():
    try:
        if "file" not in request.files:
            logger.warning("No file found in the request.")
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        file_content = file.read()

        img, metadata, is_dicom = process_dicom(file_content)

        if not is_dicom:
            file.seek(0)
            logger.info("Processing as regular image")
        else:
            logger.info("Processing as DICOM image")

        # Send image binary
        return send_file(image_segmentation(img), mimetype='image/jpeg', as_attachment=True, download_name='segmented.jpg')

    except Exception as e:
        logger.error(f"Error during segments: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@predict_bp.route("/segments/box", methods=["POST"])
def segment_box():
    try:
        if "file" not in request.files:
            logger.warning("No file found in the request.")
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        file_content = file.read()

        img, _, is_dicom = process_dicom(file_content)

        if not is_dicom:
            file.seek(0)
            logger.info("Processing as regular image")
        else:
            logger.info("Processing as DICOM image")

        return jsonify({"boxes": get_boxes(img)})

    except Exception as e:
        logger.error(f"Error during segments: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

app.register_blueprint(predict_bp)
app.register_blueprint(segment_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9999)