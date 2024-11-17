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
def mock_aws():
    """Globally mock AWS Cognito-related methods."""
    with patch("src.backend.runtime.IdentityProvider.sign_in_user") as mock_sign_in, \
         patch("src.backend.runtime.IdentityProvider.sign_up_user") as mock_sign_up, \
         patch("src.backend.runtime.IdentityProvider.get_self_user") as mock_get_self_user:
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
        query_string={"email": "test@test.com", "password": "Password123!"},  
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
