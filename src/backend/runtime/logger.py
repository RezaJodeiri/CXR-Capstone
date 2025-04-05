"""
Author: Nathan Luong
"""

import logging


class Logger:
    def __init__(self, name: str = "Top Level Logger", level: int = logging.INFO):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)

        # Create a console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(level)

        # Create a logging format
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        console_handler.setFormatter(formatter)

        # Add the handler to the logger
        self.logger.addHandler(console_handler)

    def getLogger(self):
        return self.logger


# # Example usage
# if __name__ == "__main__":
#     logger = Logger("MyLogger").getlogger()
#     logger.info("This is an info message")
#     logger.error("This is an error message")
