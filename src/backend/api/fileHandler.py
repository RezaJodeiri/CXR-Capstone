from flask import Flask, jsonify, request, Blueprint
import logging
from runtime.data.aws_s3 import S3PresignedURLHandler
from botocore.exceptions import ClientError

s3_blueprint = Blueprint("s3", __name__)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@s3_blueprint.route('/upload-url', methods=['GET'])
def generate_upload_url():
    try:
        filename = request.args.get('filename')
        content_type = request.args.get('contentType')
        
        logger.debug(f"Received request - filename: {filename}, content_type: {content_type}")

        if not filename:
            return jsonify({"error": "Missing filename parameter"}), 400
        
        if not content_type:
            return jsonify({"error": "Missing contentType parameter"}), 400
        
        try:
            s3_handler = S3PresignedURLHandler('plzplzplz')
            
            # Include all necessary parameters for the presigned URL
            params = {
                'Key': filename,
                'ContentType': content_type,
                'ACL': 'public-read'  # Make the uploaded file publicly readable
            }
            
            upload_url = s3_handler.generate_presigned_url(
                operation='put_object',
                params=params,
                expires_in=3600
            )
            
            file_url = f"https://{s3_handler.bucket_name}.s3.amazonaws.com/{filename}"
            
            logger.debug(f"Generated URLs - upload_url: {upload_url}, file_url: {file_url}")
            
            return jsonify({
                "uploadUrl": upload_url,
                "fileUrl": file_url
            })
            
        except Exception as e:
            logger.error(f"AWS S3 Error: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            return jsonify({"error": f"AWS S3 Error: {str(e)}"}), 500
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@s3_blueprint.route('/download-url', methods=['GET'])
def generate_download_url():
    filename = request.args.get('filename')
    
    if not filename:
        return jsonify({"error": "Missing filename parameter"}), 400
    
    try:
        s3_handler = S3PresignedURLHandler('plzplzplz')  # Your bucket name
        download_url = s3_handler.generate_download_url(filename)
        
        return jsonify({
            "downloadUrl": download_url
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    s3_blueprint.run(debug=True)