import requests

from ..config import Config
from ..logger import Logger

from .aws_s3 import S3PresignedURLHandler as s3

from uuid import uuid4

logger = Logger().getLogger()
S3PresignedURLHandler = s3('neuralanalyzer-xrays')

RuntimeConfig = Config()
AVAILABLE_MODELS = {
    "TORCH_XRAY_VISION": RuntimeConfig.get("MODELS")["TORCH_XRAY_VISION_MODEL_URL"],
    "NEURALANALYZER_MODEL_URL": RuntimeConfig.get("MODELS")["NEURALANALYZER_MODEL_URL"],
}


class PredictionService:

    def __init__(self):
        self.current_model_id = "NEURALANALYZER_MODEL_URL"
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
        if response.status_code == 200:
            data = response.json()
            # Return the entire response data structure
            return data
        else:
            logger.error(f"Prediction failed with status code {response.status_code}")
            return None

    def segment(self, image):
        files = {"file": image}
        response = requests.post(f"{self.current_model_url}/segments", files=files)
        logger.info(response)
        if response.status_code == 200:
            return response.content
        else:
            logger.error(f"Segmentation failed with status code {response.status_code}")
            return None

    def get_boxes_from_image_binary(self, image):
        files = {"file": image}
        response = requests.post(f"{self.current_model_url}/segments/box", files=files)
        logger.info(response)
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Box")
            return None

    def downloadImage(self, url):
        response = requests.get(url)
        if response.status_code == 200:
            return response.content
        else:
            logger.error(f"Failed to download image from {url}")
            return None
    
    def predict_from_url(self, url):
        image = self.downloadImage(url)
        if image is not None:
            return self.predict(image)
        else:
            return None

    def segment_from_url(self, url):
        image = self.downloadImage(url)
        if image is not None:
            image_binary = self.segment(image)
            segmented_image_url = S3PresignedURLHandler.upload_binary(image_binary, f"{uuid4()}.jpg")
            return segmented_image_url
            
        else:
            return None

    def segment_boxes_from_url(self, url):
        image = self.downloadImage(url)
        if image is not None:
            return self.get_boxes_from_image_binary(image)
        else:
            return None