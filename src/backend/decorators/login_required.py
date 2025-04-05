"""
Author: Nathan Luong
"""

from functools import wraps

from flask import jsonify, request
from runtime import IdentityProvider


def authentication_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"message": "Authorization token is missing."}), 401

        parts = auth_header.split()

        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"message": "Invalid Authorization header format."}), 401

        access_token = parts[1]

        # Decode and validate the token
        try:
            user = IdentityProvider.get_self_user(access_token)
            print(user)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        return f(*args, **kwargs)

    return decorated_function


def doctor_authentication_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"message": "Authorization token is missing."}), 401

        parts = auth_header.split()

        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"message": "Invalid Authorization header format."}), 401

        access_token = parts[1]

        # Decode and validate the token
        try:
            user = IdentityProvider.get_self_user(access_token)
            print(user)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        return f(*args, **kwargs)

    return decorated_function
