import unittest
from unittest.mock import patch, MagicMock
from runtime import ReportGenerationService
from runtime import PredictionService
from openai import OpenAI
from runtime import CognitoIdentityProvider
from runtime import Config
from runtime import PredictionService as PS
import inspect

# get OpenApi key
RuntimeConfig = Config()
# Test class for report generation service
class TestReportGenerationService(unittest.TestCase):
    def setUp(self):
        """Runs before each test to set up mocks and environment"""
        self.user_id = "nathandagoat"
        self.image_url = "https://mockurl.com/test-image.jpg"

        # Instantiate the ReportGenerationService
        self.report_service = ReportGenerationService()

    def test_openai_api_key_exists(self):
        """Test that the OpenAI API key is correctly set and is not None"""
        api_key = OpenAI(api_key=RuntimeConfig.get("OPENAI_API_KEY"))
        self.assertIsNotNone(api_key, "API key should not be None")
        self.assertNotEqual(api_key, "", "API key should not be an empty string")
    
    def test_user_id_exists(self):
        """Test that the user ID is set and is not None"""
        self.assertIsNotNone(self.user_id, "User ID should not be None")
        self.assertNotEqual(self.user_id, "", "User ID should not be an empty string")

    def test_image_url_exists(self):
        """Test that the image URL is set and is not None"""
        self.assertIsNotNone(self.image_url, "Image URL should not be None")
        self.assertNotEqual(self.image_url, "", "Image URL should not be an empty string")

    def test_report_generation_service_arguemnts(self):
        """Test that the ReportGenerationService instance is created correctly with correct number of arguments"""
        
        # Get the number of arguments the ReportGenerationService constructor takes
        num_args = len(inspect.signature(ReportGenerationService).parameters)
        self.assertEqual(num_args, 2, "ReportGenerationService should take 2 argument")