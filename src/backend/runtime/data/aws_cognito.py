import base64
import hashlib
import hmac

import boto3
from botocore.exceptions import ClientError

from ..config import Config
from ..logger import Logger

logger = Logger().getLogger()
aws_config = Config().get("AWS_CONFIG")


class CognitoIdentityProvider:
    def __init__(self, user_pool_id, client_id, client_secret=None):
        self.cognito_idp_client = boto3.client("cognito-idp", config=aws_config)
        self.user_pool_id = user_pool_id
        self.client_id = client_id
        self.client_secret = client_secret

    def _get_secret_hash(self, username):
        message = username + self.client_id
        dig = hmac.new(
            bytes(self.client_secret, "UTF-8"),
            msg=message.encode("UTF-8"),
            digestmod=hashlib.sha256,
        ).digest()
        secret_hash = base64.b64encode(dig).decode()
        return secret_hash

    def _get_username_from_email(self, email):
        return email.rsplit(".", 1)[0].replace("@", "_").replace(".", "_")

    def sign_up_user(self, user_email, password, user_detail):
        try:
            user = self._get_user_by_email(user_email)
            if user:
                raise Exception("UserAlreadyExists")
            user_name = self._get_username_from_email(user_email)
            kwargs = {
                "ClientId": self.client_id,
                "Username": user_name,
                "Password": password,
                "UserAttributes": [
                    {"Name": "email", "Value": user_email},
                    {"Name": "custom:first_name", "Value": user_detail["first_name"]},
                    {"Name": "custom:last_name", "Value": user_detail["last_name"]},
                    {"Name": "custom:occupation", "Value": user_detail["occupation"]},
                    {
                        "Name": "custom:organization",
                        "Value": user_detail["organization"],
                    },
                    {"Name": "custom:location", "Value": user_detail["location"]},
                ],
            }
            if self.client_secret is not None:
                kwargs["SecretHash"] = self._get_secret_hash(user_name)
            self.cognito_idp_client.sign_up(**kwargs)
        except ClientError as err:
            logger.error(
                "Couldn't sign up %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise Exception(err.response["Error"]["Code"])
        user = self._get_user_by_email(user_email)
        return user

    def sign_in_user(self, email, password):
        user_name = self._get_username_from_email(email)
        try:
            kwargs = {
                "ClientId": self.client_id,
                "AuthFlow": "USER_PASSWORD_AUTH",
                "AuthParameters": {
                    "USERNAME": user_name,
                    "PASSWORD": password,
                },
            }
            if self.client_secret is not None:
                kwargs["AuthParameters"]["SECRET_HASH"] = self._get_secret_hash(
                    user_name
                )
            response = self.cognito_idp_client.initiate_auth(**kwargs)
            return response["AuthenticationResult"]
        except ClientError as err:
            logger.error(
                "Couldn't sign in %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise Exception(err.response["Error"]["Code"])

    def get_self_user(self, access_token):
        try:
            response = self.cognito_idp_client.get_user(AccessToken=access_token)
            return response
        except ClientError as err:
            logger.error(
                "Couldn't get user info. Here's why: %s: %s",
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise Exception(err.response["Error"]["Code"])

    def _get_user_by_email(self, email):
        user_name = self._get_username_from_email(email)
        try:
            response = self.cognito_idp_client.admin_get_user(
                UserPoolId=self.user_pool_id, Username=user_name
            )
            return response
        except ClientError as err:
            if err.response["Error"]["Code"] == "UserNotFoundException":
                return None
            logger.error(
                "Couldn't get user %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise err

    def verify_token(self, token):
        try:
            response = self.cognito_idp_client.get_user(
                AccessToken=token
            )
            return True
        except ClientError:
            return False
