from unittest.mock import MagicMock
from runtime.data.aws_s3 import S3PresignedURLHandler

class MockS3PresignedURLHandler(S3PresignedURLHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.s3client = MockBoto3S3Client()


class MockBoto3S3Client(MagicMock):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def generate_presigned_url(self):
        return "https://mock-s3-bucket.s3.amazonaws.com/uploads/fake-file.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=FAKECREDENTIAL%2F20250309%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250309T000000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=FAKESIGNATURE1234567890"

    
    def upload_file(self):
        return {"message": "File uploaded successfully", "status": 200}