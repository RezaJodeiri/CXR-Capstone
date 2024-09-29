from flask import Flask
from flask_cors import CORS
from api.predict import predict_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.register_blueprint(predict_bp)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
