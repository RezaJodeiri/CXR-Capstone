from flask import Blueprint, jsonify, request

predict_bp = Blueprint("predict", __name__)


@predict_bp.route("/predict", methods=["POST"])
def predict():
    try:
        return (
            jsonify({}),
            200,
        )

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
