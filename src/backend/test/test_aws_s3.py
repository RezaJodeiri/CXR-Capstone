from .mocks.mock_s3 import MockS3PresignedURLHandler, MockBoto3S3Client
from unittest.mock import patch
import unittest

class TestS3PresignedURLHandler(unittest.TestCase): 
    def setUp(self):
        self.s3_handler = MockS3PresignedURLHandler(bucket_name="test-bucket")

    @patch.object(MockBoto3S3Client, 'generate_presigned_url', return_value="https://mocks3.com")
    def test_generate_presigned_url(self, mock_generate_presigned_url):
        """Test if generate_presigned_url returns the mocked S3 URL"""
        result = self.s3_handler.cognito_idp_client.generate_presigned_url()
        self.assertIsInstance(result, str) 
        

    @patch.object(MockBoto3S3Client, 'upload_file', return_value={"message": "File uploaded successfully", "status": 200})
    def test_upload_file(self, mock_upload_file):
        """Test if upload_file returns the expected success response"""
        result = self.s3_handler.cognito_idp_client.upload_file()
        self.assertEqual(result["message"], "File uploaded successfully")  
        self.assertEqual(result["status"], 200)  
    

        

        


        




    



