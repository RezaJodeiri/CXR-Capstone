import pytest
import base64
import hmac
import hashlib
from runtime import CognitoIdentityProvider


@pytest.fixture
def cognito_provider():
    return CognitoIdentityProvider("user_pool_id", "client_id", "client_secret")

def test_get_secret_hash(cognito_provider):
    username = "test_user"
    expected_hash = '75bCBEyYGuWS6NHejYQ+K+y8NDAPqIhAPuvwt01D9R4='
    assert cognito_provider._get_secret_hash(username) == expected_hash

def test_get_username_from_email(cognito_provider):
    email = "test.user@gmail.com"
    expected_username = "test_user_gmail"
    assert cognito_provider._get_username_from_email(email) == expected_username




