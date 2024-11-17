import pytest
from unittest.mock import patch, MagicMock
from flask import Flask
from src.backend.api.oauth import oauth_bp

@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app = Flask(__name__)
    app.register_blueprint(oauth_bp, url_prefix="/oauth")
    app.config["TESTING"] = True
    return app.test_client()


@pytest.fixture(autouse=True)
def mock_config(monkeypatch):
    """Mock environment variables for AWS configuration."""
    monkeypatch.setenv("AWS_ACCESS_KEY_ID", "mock-access-key")
    monkeypatch.setenv("AWS_SECRET_ACCESS_KEY", "mock-secret-key")
    monkeypatch.setenv("AWS_REGION", "us-east-1")


@pytest.fixture(autouse=True)
def mock_aws_cognito():
    """Mock AWS Cognito Identity Provider methods."""
    with patch("src.backend.runtime.data.aws_cognito.CognitoIdentityProvider.sign_in_user") as mock_sign_in, \
         patch("src.backend.runtime.data.aws_cognito.CognitoIdentityProvider.sign_up_user") as mock_sign_up, \
         patch("src.backend.runtime.data.aws_cognito.CognitoIdentityProvider.get_self_user") as mock_get_self_user:
        mock_sign_in.return_value = {"user_id": "123", "token": "abc123"}
        mock_sign_up.return_value = {"message": "User created successfully"}
        mock_get_self_user.return_value = {"user_id": "123", "email": "test@test.com"}
        yield


# Test /sign_in endpoint
def test_sign_in(client):
    response = client.post("/oauth/sign_in", query_string={"email": "test@test.com", "password": "password"})

    assert response.status_code == 200
    assert response.get_json() == {"user_id": "123", "token": "abc123"}


# Test /sign_up endpoint
def test_sign_up(client):
    request_body = {
        "first_name": "John",
        "last_name": "Doe",
        "occupation": "Engineer",
        "organization": "Tech Corp",
        "location": "Toronto",
    }

    response = client.post(
        "/oauth/sign_up",
        query_string={"email": "test@test.com", "password": "Password123!"},  # Meets policy
        json=request_body,
    )

    assert response.status_code == 200
    assert response.get_json() == {"message": "User created successfully"}


# Test /self endpoint
def test_get_self_user(client):
    headers = {"Authorization": "Bearer abc123"}
    response = client.get("/oauth/self", headers=headers)

    assert response.status_code == 200
    assert response.get_json() == {"user_id": "123", "email": "test@test.com"}


# Test error handling for /sign_in
def test_sign_in_error(client):
    with patch("src.backend.api.oauth.IdentityProvider.sign_in_user", side_effect=Exception("NotAuthorizedException")):
        response = client.post("/oauth/sign_in", query_string={"email": "wrong@test.com", "password": "wrong_password"})

        assert response.status_code == 401
        assert response.get_json() == {"error": "NotAuthorizedException"}


# Test error handling for /self
def test_get_self_user_error(client):
    with patch("src.backend.api.oauth.IdentityProvider.get_self_user", side_effect=Exception("NotAuthorizedException")):
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/oauth/self", headers=headers)

        assert response.status_code == 401
        assert response.get_json() == {"error": "NotAuthorizedException"}
