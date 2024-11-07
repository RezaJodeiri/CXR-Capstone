import logging
from flask import Blueprint, request, jsonify
import skimage
import torch
import torchxrayvision as xrv
import torchvision.transforms as transforms

predict_bp = Blueprint('predict', __name__)

RESET = "\033[0m"
COLORS = {
    'DEBUG': "\033[36m",      # Cyan
    'INFO': "\033[32m",       # Green
    'WARNING': "\033[33m",    # Yellow
    'ERROR': "\033[31m",      # Red
    'CRITICAL': "\033[1;31m", # Bold Red
}

class ColorFormatter(logging.Formatter):
    def format(self, record):
        log_color = COLORS.get(record.levelname, RESET)
        record.levelname = f"{log_color}{record.levelname}{RESET}"
        record.msg = f"{log_color}{record.msg}{RESET}"
        return super().format(record)

console_handler = logging.StreamHandler()
console_handler.setFormatter(ColorFormatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger = logging.getLogger(__name__)
logger.addHandler(console_handler)
logger.setLevel(logging.INFO)

model = xrv.models.DenseNet(weights="densenet121-res224-all")
model.eval()

@predict_bp.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            logger.warning("No file found in the request.")
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        img = skimage.io.imread(file)  # Read the image
        logger.info("Image successfully loaded")

        img = xrv.datasets.normalize(img, 255)  # Normalize image
        img = img.mean(2)[None, ...] if img.ndim == 3 else img[None, ...]  # Convert to grayscale

        transform = transforms.Compose([
            xrv.datasets.XRayCenterCrop(),
            xrv.datasets.XRayResizer(224),  # Resize to 224x224
        ])

        img = transform(img)  # Transform the image
        img = torch.from_numpy(img)  # Convert to a torch tensor
        outputs = model(img[None, ...])  # Perform prediction using model

        # Create a dictionary of pathologies and their confidence scores
        prediction_results = dict(zip(model.pathologies, outputs[0].detach().numpy()))
        
        # The prediction results are provided predictions for all pathologies
        logger.info(f"Predictions: {prediction_results}")

        predicted_index = outputs[0].argmax().item()  # Index of the max value (highest score)
        predicted_label = model.pathologies[predicted_index]  # Pathology with the highest score
        predicted_score = outputs[0][predicted_index].item()  # Confidence score of the predicted label

        logger.info(f"Top Prediction: {predicted_label} with confidence: {predicted_score}")

        # Return the top prediction and the confidence score
        return jsonify({
            "prediction": predicted_label,
            "confidence": predicted_score
        }), 200

    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
