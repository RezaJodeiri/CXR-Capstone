import requests

from ..config import Config
from ..logger import Logger

logger = Logger().getLogger()

RuntimeConfig = Config()
AVAILABLE_MODELS = {
    "TORCH_XRAY_VISION": RuntimeConfig.get("MODELS")["TORCH_XRAY_VISION_MODEL_URL"],
    "NEURALANALYZER_MODEL_URL": RuntimeConfig.get("MODELS")["NEURALANALYZER_MODEL_URL"],
}


class PredictionService:

    def __init__(self):
        self.current_model_id = "TORCH_XRAY_VISION"
        self.current_model_url = AVAILABLE_MODELS[self.current_model_id]

    def get_available_models(self):
        return AVAILABLE_MODELS

    def get_current_model(self):
        return self.current_model_id

    def select_model(self, model_id):
        self.current_model_url = AVAILABLE_MODELS[model_id]
        return self.current_model_url

    def predict(self, image):
        files = {"file": image}
        response = requests.post(f"{self.current_model_url}/predict", files=files)
        logger.info(response)
        return response.json()
