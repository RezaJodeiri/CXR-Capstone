import os

from .data.aws_cognito import CognitoIdentityProvider
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

IdentityProvider = CognitoIdentityProvider(
    user_pool_id=os.getenv("COGNITO_USER_POOL_ID"),
    client_id=os.getenv("COGNITO_APP_CLIENT_ID"),
    client_secret=os.getenv("COGNITO_APP_CLIENT_SECRET"),
)
