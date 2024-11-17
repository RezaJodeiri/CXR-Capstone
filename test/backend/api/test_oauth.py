import pytest
from unittest.mock import patch
from flask import Flask
from src.backend.api.oauth import oauth_bp


@pytest.fixture(autouse=True)
def mock_environment(monkeypatch):
    monkeypatch.setenv("COGNITO_USER_POOL_ID", "mock-user-pool-id")
    monkeypatch.setenv("COGNITO_APP_CLIENT_ID", "mock-client-id")
    monkeypatch.setenv("COGNITO_APP_CLIENT_SECRET", "mock-client-secret")
    monkeypatch.setenv("AWS_REGION", "mock-region")
    monkeypatch.setenv("AWS_ACCESS_KEY_ID", "mock-access-key")
    monkeypatch.setenv("AWS_SECRET_ACCESS_KEY", "mock-secret-key")


# Test client fixture
@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(oauth_bp, url_prefix="/oauth")
    app.config["TESTING"] = True
    return app.test_client()


# Test /sign_in endpoint
@patch("src.backend.api.oauth.IdentityProvider.sign_in_user")
def test_sign_in(mock_sign_in_user, client):
    mock_sign_in_user.return_value = {"user_id": "123", "token": "abc123"}

    response = client.post("/oauth/sign_in", query_string={"email": "test@test.com", "password": "password"})

    assert response.status_code == 200
    assert response.get_json() == {"user_id": "123", "token": "abc123"}
    mock_sign_in_user.assert_called_once_with(email="test@test.com", password="password")


# Test /sign_up endpoint
@patch("src.backend.api.oauth.IdentityProvider.sign_up_user")
def test_sign_up(mock_sign_up_user, client):
    mock_sign_up_user.return_value = {"message": "User created successfully"}
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
    mock_sign_up_user.assert_called_once_with(
        password="Password123!",
        user_email="test@test.com",
        user_detail=request_body,
    )


# Test /self endpoint
@patch("src.backend.api.oauth.IdentityProvider.get_self_user")
def test_get_self_user(mock_get_self_user, client):
    mock_get_self_user.return_value = {"user_id": "123", "email": "test@test.com"}

    headers = {"Authorization": "Bearer abc123"}
    response = client.get("/oauth/self", headers=headers)

    assert response.status_code == 200
    assert response.get_json() == {"user_id": "123", "email": "test@test.com"}
    mock_get_self_user.assert_called_once_with("abc123")


# Test error handling for /sign_in
@patch("src.backend.api.oauth.IdentityProvider.sign_in_user")
def test_sign_in_error(mock_sign_in_user, client):
    mock_sign_in_user.side_effect = Exception("NotAuthorizedException")

    response = client.post("/oauth/sign_in", query_string={"email": "wrong@test.com", "password": "wrong_password"})

    assert response.status_code == 401
    assert response.get_json() == {"error": "NotAuthorizedException"}


# Test error handling for /self
@patch("src.backend.api.oauth.IdentityProvider.get_self_user")
def test_get_self_user_error(mock_get_self_user, client):
    mock_get_self_user.side_effect = Exception("NotAuthorizedException")

    headers = {"Authorization": "Bearer invalid_token"}
    response = client.get("/oauth/self", headers=headers)

    assert response.status_code == 401
    assert response.get_json() == {"error": "NotAuthorizedException"}
