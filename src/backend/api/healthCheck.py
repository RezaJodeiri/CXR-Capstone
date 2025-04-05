"""
Author: Nathan Luong
"""

from flask import Blueprint, jsonify

health_check_bp = Blueprint('health_check', __name__)

@health_check_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200