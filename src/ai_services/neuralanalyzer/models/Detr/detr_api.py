"""
Author: Patrick Zhou, Reza Jodeiri
"""

import io
import os
import torch

from PIL import Image, ImageDraw, ImageFont
from .detr import Detr
from collections import defaultdict

# Constants
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "detr.ckpt")

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

color_dict = {
    1: "red", 2: "green", 3: "purple", 4: "orange",
    5: "brown", 6: "pink", 7: "blue", 8: "olive", 9: "cyan",
    10: "magenta", 11: "yellow", 12: "black"
}

# Check Device
if torch.cuda.is_available():
    device = torch.device("cuda")
elif torch.backends.mps.is_available() and torch.backends.mps.is_built():
    device = torch.device("mps")
else:
    device = torch.device("cpu")

print(f"Using device: {device}")

# Load model
model = Detr.load_from_checkpoint(MODEL_PATH, map_location=device)
model.to(device)
model.eval()
model = torch.compile(model)
print("DETR Model loaded...")

def get_boxes(binary_data):
    image = Image.open(io.BytesIO(binary_data))
    image = image.convert('RGB')

    with torch.no_grad():
        segmentations = model.get_boxes(image, scale=False)
    
    box = defaultdict(list)
    
    for segmentation in segmentations:
        region, score, x1, y1, x2, y2 = segmentation.strip().split(" ")
        region, score, x1, y1, x2, y2 = int(region), float(score), float(x1), float(y1), float(x2), float(y2)

        box[anatomical_regions[region-1]] = [score, x1, y1, x2, y2]

    return box

def image_segmentation(binary_data):
    image = Image.open(io.BytesIO(binary_data))
    image = image.convert('RGB')

    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default(size=20)

    with torch.no_grad():
        segmentations = model.get_boxes(image)

    for segmentation in segmentations:
        region, score, x1, y1, x2, y2 = segmentation.strip().split(" ")
        region, score, x1, y1, x2, y2 = int(region), float(score), float(x1), float(y1), float(x2), float(y2)
        draw.rectangle([x1, y1, x2, y2], outline=color_dict[region], width=3)
        label = f" {anatomical_regions[region-1]}: {score:.2f}"
        draw.text((x1, y1), text=label, fill=color_dict[region], font=font)

    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)

    return img_byte_arr

def get_features(binary_data):
    image = Image.open(io.BytesIO(binary_data))
    image = image.convert('RGB')

    return model.get_features(image)