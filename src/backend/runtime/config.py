import os

from botocore.config import Config as aws_config
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.


class Config:
    def __init__(self):
        config = {
            "FRONTEND_URL": os.getenv("FRONTEND_URL", default="http://localhost:3000"),
            "AWS_ACCESS_KEY_ID": os.getenv("AWS_ACCESS_KEY_ID", default=None),
            "AWS_SECRET_ACCESS_KEY": os.getenv("AWS_SECRET_ACCESS_KEY", default=None),
            "COGNITO_APP_CLIENT_SECRET": os.getenv(
                "COGNITO_APP_CLIENT_SECRET", default=None
            ),
            "COGNITO_APP_CLIENT_SECRET": os.getenv(
                "COGNITO_APP_CLIENT_SECRET", default=None
            ),
            "AWS_CONFIG": aws_config(
                region_name=os.getenv("AWS_REGION", default="us-east-2"),
                signature_version="v4",
                retries={"max_attempts": 5, "mode": "standard"},
            ),
        }
        for c in config:
            if config[c] is None:
                raise ValueError(f"Config {c} is not set")
        self.config = config

    def get_config(self):
        return self.config

    def get(self, key):
        if key not in self.config:
            return None
        return self.config.get(key)
