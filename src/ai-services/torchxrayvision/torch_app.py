import logging
import io
import numpy as np
import skimage
import torch
import torchvision.transforms as transforms
import torchxrayvision as xrv
import pydicom
from flask import Blueprint, Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

predict_bp = Blueprint("predict", __name__)

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

model = xrv.models.DenseNet(weights="densenet121-res224-all")
model.eval()

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
        
        # Convert DICOM image to array
        img = dcm.pixel_array.astype(float)
        
        # Normalize pixel values
        if img.max() != 0:
            img = (img / img.max() * 255.0).astype(np.uint8)
        
        return img, metadata, True
    except Exception as e:
        logger.error(f"Error processing DICOM: {str(e)}")
        return None, None, False


@predict_bp.route("/predict", methods=["POST"])
def predict():
    try:
        if "file" not in request.files:
            logger.warning("No file found in the request.")
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        file_content = file.read()
        
        # Try to process as DICOM first
        img, metadata, is_dicom = process_dicom(file_content)
        
        # If not DICOM, process as regular image
        if not is_dicom:
            file.seek(0)
            img = skimage.io.imread(file)
            metadata = None
            logger.info("Processing as regular image")
        else:
            logger.info("Processing as DICOM image")

        # Common image processing pipeline
        img = xrv.datasets.normalize(img, 255)
        img = img.mean(2)[None, ...] if img.ndim == 3 else img[None, ...]

        transform = transforms.Compose([
            xrv.datasets.XRayCenterCrop(),
            xrv.datasets.XRayResizer(224),
        ])

        img = transform(img)
        img = torch.from_numpy(img)
        outputs = model(img[None, ...])

        # Create prediction results
        prediction_results = dict(zip(model.pathologies, outputs[0].detach().numpy()))
        prediction_results = {
            key: float(value) for key, value in prediction_results.items()
        }

        # Prepare response
        response = {"predictions": prediction_results}
        if metadata:
            response["metadata"] = metadata

        logger.info(f"Predictions complete: {response}")
        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

app.register_blueprint(predict_bp)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
