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
        report_template =   """
                            **Findings**  
                            Summarize key positive findings from the prediction results. Group them by anatomical region if possible. Mention only relevant abnormalities and omit normal findings.

                            Example:
                            1. Right upper lobe: Consolidation suggestive of pneumonia.
                            2. Left lower lobe: Mild pleural effusion.
                            3. Cardiac silhouette: Normal size and contour.

                            **Impression**  
                            Provide a concise summary diagnosis or clinical impression based on the above findings. Avoid repeating findings verbatim. Suggest next steps or recommendations if applicable.
                            """
        # Fetch the image from the URL
        prediction = self.prediction_service.predict_from_url(xRayUrl)
        # Fetch user
        user = self.identity_provider.get_user_by_id(userId)
        # Call GPT to generate the report, tokens are charged everytime this is run.
        prompt =    f"""
                    Generate a detailed medical report using the template below. You are given predictions for 12 anatomical regions, each possibly showing up to 9 diseases with a confidence score.

                    Instructions:
                    - Include **all abnormal findings with moderate to high confidence > 0.5**.
                    - Prioritize and list them **by severity/confidence**, starting with the most critical.
                    - **Group findings by anatomical region** when appropriate.
                    - If more than 3 findings are relevant, list them all — do not limit the count arbitrarily.

                    Template:
                    {report_template}

                    Prediction (region → diseases with confidence): 
                    {prediction}
img_byte_arr
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
