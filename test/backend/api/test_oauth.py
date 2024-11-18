import pytest
from unittest.mock import MagicMock
from flask import Flask

@pytest.fixture(autouse=True)
def mock_environment(monkeypatch):
    monkeypatch.setenv("COGNITO_USER_POOL_ID", "mock-user-pool-id")
    monkeypatch.setenv("COGNITO_APP_CLIENT_ID", "mock-client-id")
    monkeypatch.setenv("COGNITO_APP_CLIENT_SECRET", "mock-client-secret")
    monkeypatch.setenv("AWS_REGION", "mock-region")
    monkeypatch.setenv("AWS_ACCESS_KEY_ID", "mock-access-key")
    monkeypatch.setenv("AWS_SECRET_ACCESS_KEY", "mock-secret-key")

@pytest.fixture
def client():
    from src.backend.api.oauth import oauth_bp
    app = Flask(__name__)
    app.register_blueprint(oauth_bp, url_prefix="/oauth")
    app.config["TESTING"] = True
    return app.test_client()

def test_sign_in(identity_provider, client):
    identity_provider.sign_in_user.return_value = {"user_id": "123", "token": "abc123"}
    response = client.post("/oauth/sign_in", query_string={"email": "test@test.com", "password": "password"})
    assert response.status_code == 200
    assert response.get_json() == {"user_id": "123", "token": "abc123"}
    identity_provider.sign_in_user.assert_called_once_with(email="test@test.com", password="password")

def test_sign_up(identity_provider, client):
    identity_provider.sign_up_user.return_value = {"message": "User created successfully"}
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
    identity_provider.sign_up_user.assert_called_once_with(
        password="Password123!",
        user_email="test@test.com",
        user_detail=request_body,
    )

def test_get_self_user(identity_provider, client):
    identity_provider.get_self_user.return_value = {"user_id": "123", "email": "test@test.com"}
    headers = {"Authorization": "Bearer abc123"}
    response = client.get("/oauth/self", headers=headers)
    assert response.status_code == 200
    assert response.get_json() == {"user_id": "123", "email": "test@test.com"}
    identity_provider.get_self_user.assert_called_once_with("abc123")

def test_sign_in_error(identity_provider, client):
    identity_provider.sign_in_user.side_effect = Exception("NotAuthorizedException")
    response = client.post("/oauth/sign_in", query_string={"email": "wrong@test.com", "password": "wrong_password"})
    assert response.status_code == 401
    assert response.get_json() == {"error": "NotAuthorizedException"}

def test_get_self_user_error(identity_provider, client):
    identity_provider.get_self_user.side_effect = Exception("NotAuthorizedException")
    headers = {"Authorization": "Bearer invalid_token"}
    response = client.get("/oauth/self", headers=headers)
    assert response.status_code == 401
    assert response.get_json() == {"error": "NotAuthorizedException"}
