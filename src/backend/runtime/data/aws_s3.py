import boto3
import requests
from botocore.config import Config
from botocore.exceptions import ClientError
import logging

logger = logging.getLogger(__name__)

class S3PresignedURLHandler:
    def __init__(self, bucket_name):
        """Initialize the handler with a bucket name"""
        self.s3_client = boto3.client('s3')
        self.bucket_name = bucket_name
    
    def generate_presigned_url(self, operation, params, expires_in=3600):
        """
        Generate a presigned URL for S3 operations
        
        Args:
            operation (str): The S3 operation (e.g., 'put_object', 'get_object')
            params (dict): Parameters for the operation
            expires_in (int): URL expiration time in seconds
            
        Returns:
            str: The presigned URL
        """
        try:
            # Ensure bucket name is in params
            params['Bucket'] = self.bucket_name
            
            # Generate the presigned URL
            url = self.s3_client.generate_presigned_url(
                ClientMethod=operation,
                Params=params,
                ExpiresIn=expires_in
            )
            
            logger.debug(f"Generated presigned URL for operation {operation}: {url}")
            return url
            
        except ClientError as e:
            logger.error(f"Error generating presigned URL: {e}")
            raise

    def generate_upload_url(self, filename, content_type=None, expires_in=3600):
        """
        Generate a presigned URL specifically for uploading (PUT)
        """
        params = {
            'Bucket': self.bucket_name,
            'Key': filename,
        }
        if content_type:
            params['ContentType'] = content_type
            
        return self.generate_presigned_url('put_object', params, expires_in)
    
    def generate_download_url(self,object_name,expiration=600):
        """Generates a pre-signed URL for downloading a file."""
        response = self.generate_presigned_url(
        'get_object',
        {'Bucket': 'plzplzplz', 'Key': object_name},
        ExpiresIn=expiration
        )
        return response

    def upload_file(self, file_path, object_name):
        """Uploads a file to S3 using a generated pre-signed URL."""
        presigned_data = self.generate_upload_url(object_name)

        with open(file_path, 'rb') as file:
            files = {'file': file}
            response = requests.post(presigned_data['url'], data=presigned_data['fields'], files=files)
        
        if response.status_code == 204:
            print(f"File {file_path} uploaded successfully.")
        else:
            print(f"Upload failed with status code {response.status_code}: {response.text}")

    def download_file(self, object_name, save_path):
        """Downloads a file from S3 using a pre-signed URL."""
        response = requests.get(self.generate_download_url(object_name))

        if response.status_code == 200:
            with open(save_path, 'wb') as file:
                file.write(response.content)
            print(f"File downloaded successfully to {save_path}")
        else:
            print(f"Download failed with status code {response.status_code}: {response.text}")


#local_file_path = '/Users/kd0819/Downloads/test_local2.pdf'
filename = 'test2.pdf'

s3_handler = S3PresignedURLHandler(bucket_name='plzplzplz')

# #s3_handler.download_file(filename, local_file_path)
print(s3_handler.generate_upload_url(filename))
# #print(s3_handler.generate_download_url(filename))