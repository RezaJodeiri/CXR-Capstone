from flask import Blueprint, jsonify, request

from runtime import IdentityProvider

oauth_bp = Blueprint("oauth", __name__)


@oauth_bp.route("/sign_in", methods=["POST"])
def sign_in():
    try:
        res = IdentityProvider.sign_in_user(
            email=request.args.get("email"), password=request.args.get("password")
        )
        return (
            jsonify(res),
            200,
        )
    except Exception as e:
        return (
            jsonify({"error": str(e)}),
            401 if str(e) == "NotAuthorizedException" else 500,
        )


@oauth_bp.route("/sign_up", methods=["POST"])
def sign_up():
    try:
        body = request.get_json()
        res = IdentityProvider.sign_up_user(
            password=request.args.get("password"),
            user_email=request.args.get("email"),
            user_detail={
                "first_name": body["first_name"],
                "last_name": body["last_name"],
                "occupation": body["occupation"],
                "organization": body["organization"],
                "location": body["location"],
            },
        )
        return (
            jsonify(res),
            200,
        )
    except Exception as e:
        return (
            jsonify({"error": str(e)}),
            500,
        )


@oauth_bp.route("/self", methods=["GET"])
def get_self_user():
    try:
        access_token = request.headers["Authorization"][7:]
        user = IdentityProvider.get_self_user(access_token)
        return (
            jsonify(user),
            200,
        )
    except Exception as e:
        return (
            jsonify({"error": str(e)}),
            401 if str(e) == "NotAuthorizedException" else 500,
        )
