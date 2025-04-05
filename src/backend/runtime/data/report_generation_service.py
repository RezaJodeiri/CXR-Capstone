"""
Author: Ayman Akhras
"""

from ..config import Config
from openai import OpenAI

# Get keys


RuntimeConfig = Config()
class ReportGenerationService:
    def __init__(self, identity_provider=None, prediction_service=None):
        self.client = OpenAI(api_key=RuntimeConfig.get("OPENAI_API_KEY"))
        if not self.client.api_key:
            raise ValueError("OPENAPI_KEY is not set in the configuration")
        self.identity_provider = identity_provider
        self.prediction_service = prediction_service

    # recordId has the xray image url within it
    def generate_report(self, userId, xRayUrl):
        report_template = """
                    **Findings**  
                    1. [Key finding 1]  
                    2. [Key finding 2]  
                    3. [Key finding 3]  
                    4. [Key finding 4]  

                    **Impression**  
                    [Summary diagnosis or conclusion]. [Next steps or recommendations].
                """
        # Fetch the image from the URL
        prediction = self.prediction_service.predict_from_url(xRayUrl)
        # Fetch user
        user = self.identity_provider.get_user_by_id(userId)
        # Call GPT to generate the report, tokens are charged everytime this is run.
        prompt = f"""Fill in the following medical report template based on the given prediction and user details:
                
                Template:
                {report_template}
                
                Prediction: {prediction}
                User details: {user}
                """

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo", messages=[{"role": "user", "content": prompt}]
        )
        report = response.choices[0].message.content.strip()
        findings, impression = report.split("**Impression**")
        findings = findings.replace("**Findings**", "").strip()
        impression = impression.strip()
        return ((findings, impression), prediction)
