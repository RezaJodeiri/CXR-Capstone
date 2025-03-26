import os
import torch

from collections import defaultdict
from src.ai_services.neuralanalyzer.models.classification.transfomer import TransformerNetwork
from src.ai_services.neuralanalyzer.models.Detr.detr_api import get_features

# Backend - Please ignore warning message
torch._dynamo.config.verbose = True

# Constants
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model.ckpt")

diseases = [
    'lung opacity',
    'pleural effusion',
    'atelectasis',
    'enlarged cardiac silhouette',
    'pulmonary edema/hazy opacity',
    'pneumothorax',
    'consolidation',
    'fluid overload/heart failure',
    'pneumonia'
]

# Check Device
if torch.cuda.is_available():
    device = torch.device("cuda")
elif torch.backends.mps.is_available() and torch.backends.mps.is_built():
    device = torch.device("mps")
else:
    device = torch.device("cpu")

print(f"Using device: {device}")

# Load Model
model = TransformerNetwork(
    in_dim=256,
    out_dim=9,
    n_heads=8,
    n_layers=2,
    hidden_dim=1024,
    dropout=0.1
)
model.to(device)
model.compile()
state_dict = {k.replace('_orig_mod.', ''): v for k, v in torch.load(MODEL_PATH).items()}
model.load_state_dict(state_dict)
model.eval()

def predict_classification(binary_data):
    features = get_features(binary_data)
    outputs = model(features.to(device))

    dic = defaultdict(list)
    for region, predictions in enumerate(outputs):
        dic[region] = [torch.sigmoid(p).item() for p in predictions]

    return dic

# Output: Dictionary with key 0-11: value [0-1 float] * 9
tmp = "00005197-869d72f3-66210bf4-fa2c9d83-b613c4e7"
img_binary = open(f"{tmp}.jpg", 'rb').read()
print(predict_classification(img_binary))