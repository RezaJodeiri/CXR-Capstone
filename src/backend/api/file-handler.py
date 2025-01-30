from flask import Flask, jsonify, request
from runtime import S3PresignedURLHandler

app = Flask(__name__)

@app.route('/generate-upload-url', methods=['GET'])
def generate_upload_url(object_name):
    data = request.json
    object_name = data.get('object_name')
    
    if not object_name:
        return jsonify({"error": "Missing object_name"}), 400
    
    s3_helper = S3PresignedURLHandler('plzplzplz')
    url_response = s3_helper.generate_upload_url(object_name)
    return jsonify(url_response)


@app.route('/generate-download-url', methods=['GET'])
def generate_download_url(object_name):
    data = request.json
    object_name = data.get('object_name')
    
    if not object_name:
        return jsonify({"error": "Missing object_name"}), 400
    
    s3_helper = S3PresignedURLHandler('plzplzplz')
    url_response = s3_helper.generate_download_url(object_name)
    return jsonify(url_response)

if __name__ == '__main__':
    app.run(debug=True)