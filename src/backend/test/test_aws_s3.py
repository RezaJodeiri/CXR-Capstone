from .mocks.mock_s3 import MockS3PresignedURLHandler, MockBoto3S3Client
from unittest.mock import patch
import unittest

class TestS3PresignedURLHandler(unittest.TestCase): 
    def setUp(self):
        self.s3_handler = MockS3PresignedURLHandler(bucket_name="test-bucket")

    def test_generate_url(self):
        """Test if generate_presigned_url returns the mocked S3 URL"""
        result = self.s3_handler.s3client.generate_presigned_url()
        self.assertIsInstance(result, str) 
        
    def test_upload_file(self):
        """Test if upload_file returns the expected success response"""
        result = self.s3_handler.s3client.upload_file()
        self.assertEqual(result["message"], "File uploaded successfully")  
        self.assertEqual(result["status"], 200)  
    

        

        


        




    



