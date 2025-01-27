import boto3

# Initialize the S3 client
s3_client = boto3.client('s3')

# Create a new bucket (if needed)
# s3_client.create_bucket(Bucket='my-new-bucket')

# Upload a file
s3_client.upload_file('/Users/kd0819/Downloads/resume_kellydeng.pdf', 'plzplzplz', 'test.pdf')

response = s3_client.list_buckets()
print("Buckets:")
for bucket in response['Buckets']:
    print(bucket['Name'])

# Download a file
s3_client.download_file('plzplzplz', 'test.pdf', '/Users/kd0819/Downloads/test_local.pdf')