import os


class Config:
    def __init__(self):
        config = {
            "FRONTEND_URL": os.environ.get("FRONTEND_URL"),
            "AWS_ACCESS_KEY_ID": os.environ.get("AWS_ACCESS_KEY_ID"),
            "AWS_SECRET_ACCESS_KEY": os.environ.get("AWS_SECRET_ACCESS_KEY"),
        }
        for c in config:
            if config[c] is None:
                raise ValueError(f"Config {c} is not set")
        self.config = {
            "FRONTEND_URL": config["FRONTEND_URL"],
            "AWS_ACCESS_KEY_ID": config["AWS_ACCESS_KEY_ID"],
            "AWS_SECRET_ACCESS_KEY": config["AWS_SECRET_ACCESS_KEY"],
        }

    def get_config(self):
        return self.config

    def get(self, key):
        if key not in self.config:
            return None
        return self.config.get(key)
