import random

# Not yet finished on grace yet so this is a dummy function
def predict_classification(image_binary):
    return {i: [random.uniform(0, 1) for _ in range(9)] for i in range(12)}