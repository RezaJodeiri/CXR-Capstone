from functools import wraps
from flask import request, jsonify
from runtime import IdentityProvider

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'No authorization header'}), 401
        
        try:
            token = auth_header.split(' ')[1]
            if not IdentityProvider.verify_token(token):
                return jsonify({'message': 'Invalid token'}), 401
        except Exception:
            return jsonify({'message': 'Invalid token format'}), 401
            
        return f(*args, **kwargs)
    return decorated 