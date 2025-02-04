import logging
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from predict import DiseasePredictor
import traceback
from utils.constants import DISEASES
from werkzeug.utils import secure_filename

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
RESET = "\033[0m"
COLORS = {
    "DEBUG": "\033[36m",
    "INFO": "\033[32m",
    "WARNING": "\033[33m",
    "ERROR": "\033[31m",
    "CRITICAL": "\033[1;31m",
}

class ColorFormatter(logging.Formatter):
    def format(self, record):
        log_color = COLORS.get(record.levelname, RESET)
        record.levelname = f"{log_color}{record.levelname}{RESET}"
        record.msg = f"{log_color}{record.msg}{RESET}"
        return super().format(record)

# Set up logging
logger = logging.getLogger(__name__)
console_handler = logging.StreamHandler()
console_handler.setFormatter(
    ColorFormatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
)
logger.addHandler(console_handler)
logger.setLevel(logging.INFO)

# Configure upload folder
UPLOAD_FOLDER = 'temp_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize predictor
try:
    predictor = DiseasePredictor()
    logger.info("Disease predictor initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize predictor: {e}")
    raise

@app.route("/", methods=["GET"])
def home():
    """Home endpoint"""
    return jsonify({"message": "Welcome to NeuralAnalyzer API"}), 200

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200

def process_prediction(image_path):
    """Process image and return predictions"""
    try:
        # Get predictions using predictor
        results = predictor.predict(image_path)
        
        # Format predictions for response
        predictions = {}
        for region in results.index:
            predictions[region] = {
                'findings': results.loc[region, 'Findings'],
                'detected_diseases': list(results.loc[region, 'Detected_Diseases']),  # Convert to list
                'probabilities': {
                    k: float(v) for k, v in results.loc[region, 'All_Probabilities'].items()  # Ensure floats
                },
                'valid': bool(results.loc[region, 'Valid'])  # Convert to Python bool
            }
        
        return {
            "predictions": predictions,
            "metadata": {
                "threshold": float(predictor.config.DISEASE_THRESHOLD),  # Convert to float
                "total_diseases": int(len(DISEASES)),  # Convert to int
                "diseases_list": list(DISEASES)  # Convert to list
            }
        }
    except Exception as e:
        logger.error(f"Error processing prediction: {e}")
        logger.error(traceback.format_exc())
        raise
@app.route("/predict", methods=["POST"])
def predict():
    """Main prediction endpoint"""
    logger.info("Predict endpoint accessed")
    temp_path = None
    
    try:
        # Validate request
        if "file" not in request.files:
            logger.warning("No file in request")
            return jsonify({"error": "No file uploaded"}), 400
            
        file = request.files["file"]
        if not file.filename:
            logger.warning("Empty filename")
            return jsonify({"error": "No file selected"}), 400
        
        # Save file securely
        filename = secure_filename(file.filename)
        temp_path = os.path.join(UPLOAD_FOLDER, f"temp_{filename}")
        file.save(temp_path)
        logger.info(f"Saved file to {temp_path}")
        
        # Process prediction
        response = process_prediction(temp_path)
        logger.info("Prediction completed successfully")
        
        return jsonify(response), 200
        
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error during prediction: {error_msg}")
        return jsonify({"error": error_msg}), 500
        
    finally:
        # Cleanup
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
                logger.debug(f"Cleaned up temporary file: {temp_path}")
            except Exception as e:
                logger.warning(f"Failed to clean up {temp_path}: {e}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    
    logger.info(f"Starting server on port {port} (debug={debug})")
    
    try:
        app.run(
            host="0.0.0.0",
            port=port,
            debug=debug
        )
    except Exception as e:
        logger.error(f"Server failed to start: {e}")
        raise