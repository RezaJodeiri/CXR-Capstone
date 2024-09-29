import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import skimage
import torch
import torchxrayvision as xrv
import torchvision.transforms as transforms

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
logging.basicConfig(level=logging.DEBUG)

# Load the CheXpert pre-trained model
model = xrv.models.DenseNet(weights="densenet121-res224-chex")
model.eval()

@app.route('/')
def index():
    return jsonify({"message": "CXR API is running with the CheXpert model"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        logging.info("Request received!")

        # Check if the request contains a file
        if 'file' not in request.files:
            logging.warning("No file found in the request.")
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        img = skimage.io.imread(file)  # Read the image
        logging.info("Image successfully loaded ")

        img = xrv.datasets.normalize(img, 255)  # Normalize image
        img = img.mean(2)[None, ...]  # Convert to a single color channel
        logging.info("Image normalized and converted to single channel")

        transform = transforms.Compose([
            xrv.datasets.XRayCenterCrop(),
            xrv.datasets.XRayResizer(224),  # Resize to 224x224
        ])

        img = transform(img)  # Transform the image
        img = torch.from_numpy(img)  # Convert to a torch tensor

        # Perform the model prediction
        outputs = model(img[None, ...])  # Perform prediction using model
        logging.info("Model prediction successful")

        # Create a dictionary of pathologies and their confidence scores
        prediction_results = dict(zip(model.pathologies, outputs[0].detach().numpy()))

        # Log the entire dictionary of predictions
        logging.info(f"Predictions: {prediction_results}")

        predicted_index = outputs[0].argmax().item()  # Index of the max value (highest score)
        predicted_label = model.pathologies[predicted_index]  # Pathology with the highest score
        predicted_score = outputs[0][predicted_index].item()  # Confidence score of the predicted label

        logging.info(f"Top Prediction: {predicted_label} with confidence: {predicted_score}")

        # Return the top prediction and the confidence score
        return jsonify({
            "prediction": predicted_label,
            "confidence": predicted_score
        }), 200

    except Exception as e:
        logging.error(f"Error during prediction: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
