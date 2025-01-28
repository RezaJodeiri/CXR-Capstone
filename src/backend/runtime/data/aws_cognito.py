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

    def _parse_user_json_from_cognito_user(self, cognito_user):
        if not cognito_user:
            return None
        user_attributes = cognito_user["Attributes"]
        user_json = {
            attr["Name"].replace("custom:", ""): attr["Value"]
            for attr in user_attributes
        }
        user_json["id"] = user_json["sub"]
        user_json["email_verified"] = user_json["email_verified"] == "true"
        user_json["is_doctor"] = user_json["is_doctor"] == "true"
        user_json["enabled"] = cognito_user["Enabled"]
        user_json["user_create_date"] = cognito_user["UserCreateDate"]
        user_json["user_last_modified_date"] = cognito_user["UserLastModifiedDate"]
        user_json["user_status"] = cognito_user["UserStatus"]
        user_json["username"] = cognito_user["Username"]
        return user_json

    def _parse_custom_cognito_attr_user_from_user_json(self, user_json):
        if not user_json:
            return None

        UserAttributes = [
            {"Name": "custom:first_name", "Value": user_json["first_name"]},
            {"Name": "custom:last_name", "Value": user_json["last_name"]},
            {"Name": "custom:occupation", "Value": user_json["occupation"]},
            {
                "Name": "custom:organization",
                "Value": user_json["organization"],
            },
            {"Name": "custom:location", "Value": user_json["location"]},
            {"Name": "custom:is_doctor", "Value": user_json["is_doctor"]},
        ]

        return UserAttributes

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

    def _sign_up_user(self, user_email, password, user_detail):
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
                    {"Name": "gender", "Value": user_detail.get("gender", "other")},
                    {
                        "Name": "birthdate",
                        "Value": user_detail.get("birthdate", "yyyy-mm-dd"),
                    },
                    {
                        "Name": "custom:first_name",
                        "Value": user_detail.get("first_name", ""),
                    },
                    {
                        "Name": "custom:last_name",
                        "Value": user_detail.get("last_name", ""),
                    },
                    {
                        "Name": "custom:occupation",
                        "Value": user_detail.get("occupation", ""),
                    },
                    {
                        "Name": "custom:organization",
                        "Value": user_detail.get("organization", ""),
                    },
                    {
                        "Name": "custom:location",
                        "Value": user_detail.get("location", ""),
                    },
                    {
                        "Name": "custom:is_doctor",
                        "Value": user_detail.get("is_doctor", "false"),
                    },
                    {
                        "Name": "custom:doctor_id",
                        "Value": user_detail.get("doctor_id", ""),
                    },
                    {
                        "Name": "name",
                        "Value": user_detail.get("doctor_id", ""),
                    },
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

    def sign_up_doctor(self, user_email, password, user_detail):
        try:
            user_detail["is_doctor"] = "true"
            user = self._sign_up_user(user_email, password, user_detail)
            # Confirm the user
            user_name = self._get_username_from_email(user_email)
            self.cognito_idp_client.admin_confirm_sign_up(
                UserPoolId=self.user_pool_id, Username=user_name
            )
            return user
        except ClientError as err:
            logger.error(
                "Couldn't confirm sign up %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise Exception(err.response["Error"]["Code"])

    def create_patient(self, doctor_id, patient_email, patient_detail):
        """
        Args:
            doctor_id (str): The ID of the doctor associated with the patient.
            patient_user_name (str): The email address of the patient.
            password (str): The password for the patient's account. Auto generated randomly
            patient_detail["name"] (str):
            patient_detail["gender"] ("male", "female", "other"):
            patient_detail["birthdate"] (str): The birthdate of the patient in the format "YYYY-01-01".
        Returns:
            dict: A dictionary containing information about the newly created user.
        """

        try:
            user_detail = {
                "is_doctor": "false",
                "doctor_id": doctor_id,
                "location": "",
                "organization": "",
                "occupation": "Patient",
                "gender": patient_detail["gender"].lower(),
                "birthdate": patient_detail["birthdate"],
                "last_name": patient_detail["name"].split(" ")[-1],
                "first_name": " ".join(patient_detail["name"].split(" ")[:-1]),
            }
            user_name = self._get_username_from_email(patient_email) + "_T2!"
            user = self._sign_up_user(patient_email, user_name, user_detail)
            return user
        except ClientError as err:
            logger.error(
                "Couldn't confirm sign up %s. Here's why: %s: %s",
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise Exception(err.response["Error"]["Code"])

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
            user_json = {
                attr["Name"].replace("custom:", ""): attr["Value"]
                for attr in response["UserAttributes"]
            }
            user_json["id"] = user_json["sub"]
            user_json["is_doctor"] = user_json["is_doctor"] == "true"
            user_json["email_verified"] = user_json["email_verified"] == "true"
            return user_json
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
            self.cognito_idp_client.get_user(AccessToken=token)
            return True
        except ClientError:
            return False

    def get_user_by_id(self, uuid):
        try:
            response = self.cognito_idp_client.list_users(
                UserPoolId=self.user_pool_id, Filter=f'sub = "{uuid}"'
            )
            if response["Users"]:
                return self._parse_user_json_from_cognito_user(response["Users"][0])
            return None
        except ClientError as err:
            logger.error(
                "Couldn't get user by id %s. Here's why: %s: %s",
                uuid,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise err

    def get_patients_by_doctor_id(self, uuid):
        try:
            response = self.cognito_idp_client.list_users(
                UserPoolId=self.user_pool_id, Filter=f'name = "{uuid}"'
            )
            if response["Users"]:
                return map(self._parse_user_json_from_cognito_user, response["Users"])
            return None
        except ClientError as err:
            logger.error(
                "Couldn't get user by id %s. Here's why: %s: %s",
                uuid,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise err

    def update_user_by_id(self, uuid, updated_user_json):
        try:
            current_user = self.get_user_by_id(uuid)
            if not current_user:
                raise Exception("UserNotFoundException")
            updated_user_attr = self._parse_custom_cognito_attr_user_from_user_json(
                updated_user_json
            )
            self.cognito_idp_client.admin_update_user_attributes(
                UserPoolId=self.user_pool_id,
                Username=current_user["username"],
                UserAttributes=updated_user_attr,
            )
            return {
                "updated": "success",
                "userId": current_user["sub"],
                "username": current_user["username"],
            }
        except ClientError as err:
            logger.error(
                "Couldn't edit user %s. Here's why: %s: %s",
                uuid,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise Exception(err.response["Error"]["Code"])
