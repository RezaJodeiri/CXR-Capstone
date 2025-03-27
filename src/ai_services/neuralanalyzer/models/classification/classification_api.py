import os
import torch

from collections import defaultdict
from .transfomer import TransformerNetwork
from ..Detr.detr_api import get_features

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

anatomical_regions = [
    'right upper lung zone',
    'right mid lung zone',
    'right lower lung zone',
    'right costophrenic angle',
    'right hilar structures',
    'right apical zone',
    'left upper lung zone',
    'left mid lung zone',
    'left lower lung zone',
    'left costophrenic angle',
    'left hilar structures',
    'cardiac silhouette',
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
    return {anatomical_regions[i]: {disease: float(pred) for disease, pred in zip(diseases, output)} for i, output in enumerate(torch.sigmoid(outputs))}