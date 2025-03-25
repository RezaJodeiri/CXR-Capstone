import unittest
from runtime import ReportGenerationService
from openai import OpenAI
from runtime import Config

# get OpenApi key
RuntimeConfig = Config()
# Test class for report generation service
class TestReportGenerationService(unittest.TestCase):
    def setUp(self):
        """Runs before each test.jpg to set up mocks and environment"""
        self.user_id = "nathandagoat"
        self.image_url = "https://mockurl.com/test-image.jpg"

        # Instantiate the ReportGenerationService
        self.report_service = ReportGenerationService

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

    def test_generate_report(self):
        """Test that the generate_report method returns a report and prediction"""
        report = self.report_service.generate_report(self.user_id, self.image_url)
        ((findings, impression), prediction) = report
        self.assertIsNotNone(report, "Report should not be None")
        self.assertIsNotNone(findings, "Findings should not be None")
        self.assertIsNotNone(impression, "Impression should not be None")
        self.assertIsNotNone(prediction, "Prediction should not be None")