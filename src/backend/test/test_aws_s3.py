import unittest
import boto3
import requests
from moto import mock_s3
from botocore.exceptions import NoCredentialsError
from runtime import S3PresignedURLHandler  # Import the class
import os

# Test class for S3PresignedURLHandler
@mock_s3  # Mock AWS S3
class TestS3PresignedURLHandler(unittest.TestCase):

    def setUp(self):
        """Runs before each test to set up mock S3"""
        self.bucket_name = "test-bucket"
        self.region = "us-east-2"
        
        # Create a mock S3 client and bucket
        self.s3_client = boto3.client("s3", region_name=self.region)
        self.s3_client.create_bucket(Bucket=self.bucket_name)

        # Instantiate the handler
        self.s3_handler = S3PresignedURLHandler(self.bucket_name, self.region)

        # Create a temporary test file
        self.test_file = "test_file.txt"
        with open(self.test_file, "w") as f:
            f.write("This is a test file.")

    def tearDown(self):
        """Runs after each test to clean up"""
        if os.path.exists(self.test_file):
            os.remove(self.test_file)

    def test_generate_upload_url(self):
        """Test generating an S3 pre-signed upload URL"""
        object_name = "test_upload.txt"
        presigned_data = self.s3_handler.generate_upload_url(object_name)

        self.assertIn("url", presigned_data)
        self.assertIn("fields", presigned_data)


    def test_upload_file_success(self):
        """Test successful file upload using a pre-signed URL"""
        object_name = "test_upload.txt"
        self.s3_handler.upload_file(self.test_file, object_name)

        # Check if the file exists in the mock S3 bucket
        response = self.s3_client.list_objects_v2(Bucket=self.bucket_name)
        self.assertIn("Contents", response)
        self.assertEqual(response["Contents"][0]["Key"], object_name)

# Run the tests
# if __name__ == '__main__':
#     unittest.main()