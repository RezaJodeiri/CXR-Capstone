"""
Author: Nathan Luong
"""

from runtime.data.report_generation_service import ReportGenerationService

class MockOpenAI:
    def __init__(self, api_key=None):
        self.api_key = api_key

    class chat:
        class completions:
            @staticmethod
            def create(model, messages):
                return MockResponse()

class MockResponse:
    def __init__(self):
        self.choices = [MockChoice()]

class MockChoice:
    def __init__(self):
        self.message = MockMessage()

class MockMessage:
    def __init__(self):
        self.content = """
        **Findings**  
        1. Example finding 1  
        2. Example finding 2  
        3. Example finding 3  
        4. Example finding 4  

        **Impression**  
        Example summary diagnosis or conclusion. Example next steps or recommendations.
        """


class MockReportGenerationService(ReportGenerationService):
    def __init__(self, identity_provider=None, prediction_service=None):
        self.client = MockOpenAI(api_key="xxx")
        self.identity_provider = identity_provider
        self.prediction_service = prediction_service