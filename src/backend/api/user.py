"""
Author: Nathan Luong
"""

from flask import Blueprint, jsonify, request
from runtime import IdentityProvider

# Define the blueprint
user_blueprint = Blueprint("user", __name__)


@user_blueprint.route("/<userId>", methods=["GET", "POST"])
def handle_user_by_id(userId):
    if request.method == "GET":
        user = IdentityProvider.get_user_by_id(userId)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(user)
    elif request.method == "POST":
        user = IdentityProvider.update_user_by_id(userId, request.json)
        return jsonify(user)
