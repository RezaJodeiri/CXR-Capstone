"""
Author: Nathan Luong
"""

from runtime.data.prediction_services import PredictionService

class MockPredictionService(PredictionService):
    def __init__(self):
        self.current_model_id = "TORCH_XRAY_VISION"
        self.current_model_url = "http://torchxrayvision_model/"
        

    def predict_from_url(self, xRayUrl):
        return {
            "Atelectasis": 0.9077080488204956,
            "Cardiomegaly": 0.7984980344772339,
            "Consolidation": 0.945807933807373,
            "Edema": 0.6711509227752686,
            "Effusion": 0.975169837474823,
            "Emphysema": 0.5019056797027588,
            "Enlarged Cardiomediastinum": 0.8253458142280579,
            "Fibrosis": 0.16465544700622559,
            "Fracture": 0.7067481279373169,
            "Hernia": 0.000913103052880615,
            "Infiltration": 0.3041574954986572,
            "Lung Lesion": 0.9557620286941528,
            "Lung Opacity": 0.9330040812492371,
            "Mass": 0.6472741365432739,
            "Nodule": 0.5323363542556763,
            "Pleural_Thickening": 0.3060512840747833,
            "Pneumonia": 0.7339105606079102,
            "Pneumothorax": 0.680419921875
        }
