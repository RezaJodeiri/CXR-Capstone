from .aws_dynamodb.medical_record_service import MedicalRecordService as MRS
from .prediction_services import PredictionService as PS
from ..config import Config
from .aws_cognito import CognitoIdentityProvider
from openai import OpenAI

# Get keys 
RuntimeConfig = Config()

client = OpenAI(
    api_key=RuntimeConfig.get("OPENAI_API_KEY")
)

IdentityProvider = CognitoIdentityProvider(
    user_pool_id=RuntimeConfig.get("COGNITO_USER_POOL_ID"),
    client_id=RuntimeConfig.get("COGNITO_APP_CLIENT_ID"),
    client_secret=RuntimeConfig.get("COGNITO_APP_CLIENT_SECRET"),
)

class ReportGenerationService:
    def __init__(self):
        if not client.api_key:
            raise ValueError("OPENAPI_KEY is not set in the configuration")
    # recordId has the xray image url within it 
    def generate_report(self, userId, imageUrl):
                # Fetch the image from the URL
                print(imageUrl)
                print("Test")
                PredictionService = PS()
                prediction = PredictionService.predict_from_url(imageUrl)
                # Fetch user
                user = IdentityProvider.get_user_by_id(userId)
                # Call GPT to generate the report, tokens are charged everytime this is run. 
                prompt = f"Generate a medical report for the following prediction: {prediction} and user details: {user}"
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}]
                )
                report = response.choices[0].message.content.strip()
                return report

