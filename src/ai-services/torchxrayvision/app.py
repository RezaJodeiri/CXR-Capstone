import logging

import skimage
import torch
import torchvision.transforms as transforms
import torchxrayvision as xrv
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


@predict_bp.route("/predict", methods=["POST"])
def predict():
    try:
        if "file" not in request.files:
            logger.warning("No file found in the request.")
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        img = skimage.io.imread(file)  # Read the image
        logger.info("Image successfully loaded")

        img = xrv.datasets.normalize(img, 255)  # Normalize image
        img = (
            img.mean(2)[None, ...] if img.ndim == 3 else img[None, ...]
        )  # Convert to grayscale

        transform = transforms.Compose(
            [
                xrv.datasets.XRayCenterCrop(),
                xrv.datasets.XRayResizer(224),  # Resize to 224x224
            ]
        )

        img = transform(img)  # Transform the image
        img = torch.from_numpy(img)  # Convert to a torch tensor
        outputs = model(img[None, ...])  # Perform prediction using model

        # Create a dictionary of pathologies and their confidence scores
        prediction_results = dict(zip(model.pathologies, outputs[0].detach().numpy()))
        prediction_results = {
            key: float(value) for key, value in prediction_results.items()
        }

        # The prediction results are provided predictions for all pathologies
        logger.info(f"Predictions: {prediction_results}")

        return (
            jsonify(prediction_results),
            200,
        )

    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


app.register_blueprint(predict_bp)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
