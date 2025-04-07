# Source Code of open-source NeuralAnalyzer AI Service

Please refer to the **Getting Started** section in the [README.md](README.md) for complete installation instructions for developer.

## Directory Structure

```txt
.src/ai_services/neuralanalyzer/
    ├── Dockerfile                        # Container config for AI services
    ├── README.md
    ├── models
    │   ├── Detr
    │   │   ├── Detr.ckpt                 # Pre-trained object detection checkpoint
    │   │   ├── detr.py                   # Object detection model
    │   │   └── detr_api.py               # Object detection API
    │   ├── __init__.py
    │   └── classification
    │       ├── classification_api.py     # Classification API
    │       ├── model.ckpt                # Pre-trained classification checkpoint
    │       └── transfomer.py             # Transformer model
    ├── neural_app.py                     # Main entry point for the AI service
    └── requirements.txt                  # Dependencies for AI services
```
