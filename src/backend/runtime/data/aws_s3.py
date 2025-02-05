import boto3
import requests
from botocore.config import Config

class S3PresignedURLHandler:
    def __init__(self, bucket_name, region="us-east-2"):
        self.s3_client = boto3.client(
            's3',
            region_name=region,
            config=Config(signature_version='s3v4')  # Ensure Signature Version 4
        )
        self.bucket_name = bucket_name

    def generate_upload_url(self,object_name,expiration=1000):
        """
        Generate a presigned Amazon S3 URL that can be used to perform an action.
        """
        response = self.s3_client.generate_presigned_url(
                'put_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=expiration
                )
        
        return response
    
    def generate_download_url(self,object_name,expiration=1000):
        """Generates a pre-signed URL for downloading a file."""
        response = self.s3_client.generate_presigned_url(
        'get_object',
        Params={'Bucket': self.bucket_name, 'Key': object_name},
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

s3_handler = S3PresignedURLHandler('neuralanalyzer-xrays')

# #s3_handler.download_file(filename, local_file_path)
print(s3_handler.generate_upload_url(filename))
# #print(s3_handler.generate_download_url(filename))