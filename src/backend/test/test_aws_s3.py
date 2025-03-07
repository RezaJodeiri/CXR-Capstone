import boto3
import pytest
import requests
from moto import mock_s3
from botocore.exceptions import NoCredentialsError
from runtime import S3PresignedURLHandler
from unittest.mock import patch

@pytest.fixture
def mock_post(url,data,files):
    response = {
        "status_code": 204,
        "headers": {
            "x-amz-request-id": "example-request-id",
            "x-amz-id-2": "example-amz-id",
            "Content-Length": "0"
        }
        }

    return response 



@pytest.fixture
def test_generate_upload_url():
    """Test generating an S3 pre-signed upload URL."""

    # Mock expected response
    expected_response = {
        "url": "https://mocked-s3-url.com",
        "fields": {"key": "test_upload.txt"}
    }

    return expected_response

@pytest.fixture
def test_upload_file_success(self, file_path = "xxx/xxx/image.pdf"):
    """Test file upload using mocked requests.post (for pre-signed URL upload)."""
    presigned_data = self.test_generate_upload_url()

    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = mock_post(presigned_data['url'], data=presigned_data['fields'], files=files)
    
    assert response["status_code"] == 204
    




    



