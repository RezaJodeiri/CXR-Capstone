from unittest.mock import MagicMock
from runtime.data.aws_s3 import S3PresignedURLHandler

class MockS3PresignedURLHandler(S3PresignedURLHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.cognito_idp_client = MockBoto3S3Client()


class MockBoto3S3Client(MagicMock):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def generate_presigned_url(self):
        return "https://mocks3.com"
    
    def upload_file(self):
        return {"message": "File uploaded successfully", "status": 200}