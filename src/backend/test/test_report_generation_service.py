import unittest
from unittest.mock import patch, MagicMock
from runtime import ReportGenerationService
from ..runtime.data.prediction_services import PredictionService
from openai import OpenAI
from ..runtime.data.aws_cognito import CognitoIdentityProvider
from ..runtime.config import Config
from ..runtime.data.prediction_services import PredictionService as PS

# Test class for report generation service
class TestReportGenerationService(unittest.TestCase):

    def setUp(self):
        """Runs before each test to set up mocks and environment"""
        self.user_id = "12345"
        self.image_url = "https://mockurl.com/test-image.jpg"
        
        # Mock Configuration
        self.mock_config = MagicMock(Config)
        self.mock_config.get.return_value = "mock_value"
        
        # Mock OpenAI client
        self.mock_openai = MagicMock(OpenAI)
        self.mock_openai.api_key = "mock_api_key"

        # Mock CognitoIdentityProvider
        self.mock_identity_provider = MagicMock(CognitoIdentityProvider)
        self.mock_identity_provider.get_user_by_id.return_value = {"user_id": self.user_id, "name": "John Doe"}

        # Instantiate the ReportGenerationService
        self.report_service = ReportGenerationService()

    def tearDown(self):
        """Runs after each test to clean up"""
        pass

    @patch.object(OpenAI, 'api_key', new_callable=MagicMock)
    @patch.object(CognitoIdentityProvider, 'get_user_by_id', return_value={"user_id": "12345", "name": "John Doe"})
    def test_initialization_without_api_key(self, mock_get_user_by_id, mock_api_key):
        """Test that initialization raises an error if the API key is not set"""
        
        # Simulate no API key being set
        mock_api_key.return_value = None
        
        with self.assertRaises(ValueError) as context:
            ReportGenerationService()
        
        self.assertEqual(str(context.exception), "OPENAPI_KEY is not set in the configuration")

    @patch.object(OpenAI, 'chat.completions.create', return_value=MagicMock(choices=[MagicMock(message=MagicMock(content="Mock Findings **Impression** Mock Impression"))]))
    @patch.object(PredictionService, 'predict_from_url', return_value="Mock Prediction")
    @patch.object(CognitoIdentityProvider, 'get_user_by_id', return_value={"user_id": "12345", "name": "John Doe"})
    def test_generate_report(self, mock_get_user_by_id, mock_predict, mock_create):
        """Test the report generation process"""

        # Simulate a successful report generation
        report, prediction = self.report_service.generate_report(self.user_id, self.image_url)

        # Assert that the report generation returned the correct values
        self.assertEqual(report[0], "Mock Findings")
        self.assertEqual(report[1], "Mock Impression")
        self.assertEqual(prediction, "Mock Prediction")

    @patch.object(OpenAI, 'chat.completions.create', return_value=MagicMock(choices=[MagicMock(message=MagicMock(content="Mock Findings **Impression** Mock Impression"))]))
    @patch.object(PredictionService, 'predict_from_url', return_value="Mock Prediction")
    @patch.object(CognitoIdentityProvider, 'get_user_by_id', return_value={"user_id": "12345", "name": "John Doe"})
    def test_generate_report_with_prediction(self, mock_get_user_by_id, mock_predict, mock_create):
        """Test report generation with prediction data"""

        # Call the generate_report function
        report, prediction = self.report_service.generate_report(self.user_id, self.image_url)

        # Verify that prediction is correctly passed to the report
        self.assertEqual(prediction, "Mock Prediction")
        self.assertIn("Mock Findings", report[0])
        self.assertIn("Mock Impression", report[1])


if __name__ == "__main__":
    unittest.main()
