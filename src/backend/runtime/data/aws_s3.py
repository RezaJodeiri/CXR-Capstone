import boto3

# Initialize the S3 client
s3_client = boto3.client('s3')

# Create a new bucket (if needed)
# s3_client.create_bucket(Bucket='my-new-bucket')

# Upload a file
def get_file(local_file_path,filename):
    #local_file_path = '/Users/kd0819/Downloads/test_local.pdf'
    #filename - 'test.pdf'
    bucket = 'plzplzplz'
    s3_client.upload_file(local_file_path, bucket, filename)

response = s3_client.list_buckets()
print("Buckets:")
for bucket in response['Buckets']:
    print(bucket['Name'])

# Download a file
def download_file(local_file_path,filename):
    #local_file_path = '/Users/kd0819/Downloads/test_local.pdf'
    #filename - 'test.pdf'
    bucket = 'plzplzplz'
    s3_client.download_file(bucket, filename, local_file_path)
    print(f"File downloaded to {local_file_path}")