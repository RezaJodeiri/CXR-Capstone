from .mocks.mock_s3 import MockBoto3S3Client
from unittest.mock import patch

class TestS3PresignedURLHandler():

    @patch.object(MockBoto3S3Client, 'generate_presigned_url', return_value="https://mocks3.com")
    def test_generate_upload_url(self,mock_generate_presigned_url):
        """Test generating an S3 pre-signed upload URL."""

        url = MockBoto3S3Client.generate_presigned_url()
        assert isinstance(url, str)
    
    @patch.object(MockBoto3S3Client, 'upload_file', return_value={"message": "File uploaded successfully", "status": 200})
    def test_upload_url(self,mock_upload_file):
        response = MockBoto3S3Client.upload_file()

        assert(response["status"], 200)
        

        


        




    



