from runtime import MedicalRecordService
from runtime import PredictionService
from config import Config
from data.aws_cognito import CognitoIdentityProvider
import openai

RuntimeConfig = Config()

IdentityProvider = CognitoIdentityProvider(
    user_pool_id=RuntimeConfig.get("OPENAPI_KEY"),
)

class ReportGenerationService:
    def __init__(self):
        if not RuntimeConfig.get("OPENAPI_KEY"):
            raise ValueError("OPENAPI_KEY is not set in the configuration")
    # recordId has the xray image url within it 
    def generate_report(self,userId, recordId):
        # Implement the logic to generate the report
        # in that fucntion first fetch record
        record = MedicalRecordService.get_record_by_id(recordId)
        # then fetch the image from the url
        prediciton = PredictionService.predict_from_url(record["xrayImageUrl"])
        # fetch user
        user = IdentityProvider.get_user_by_id(userId)


        # call gpt to generate the report
        # return the report

    
    openai.api_key = RuntimeConfig.get("OPENAI_API_KEY")
    print("hello :D ")
    class ReportGenerationService:
        def __init__(self):
            if not RuntimeConfig.get("OPENAPI_KEY"):
                raise ValueError("OPENAPI_KEY is not set in the configuration")
            if not RuntimeConfig.get("OPENAI_API_KEY"):
                raise ValueError("OPENAI_API_KEY is not set in the configuration")

        def generate_report(self, userId, recordId):
            # Fetch record
            record = MedicalRecordService.get_record_by_id(recordId)
            # Fetch the image from the URL
            prediction = PredictionService.predict_from_url(record["xrayImageUrl"])
            # Fetch user
            user = IdentityProvider.get_user_by_id(userId)

            # Call GPT to generate the report
            prompt = f"Generate a medical report for the following prediction: {prediction} and user details: {user}"
            response = openai.Completion.create(
                engine="davinci",
                prompt=prompt,
                max_tokens=150
            )
            report = response.choices[0].text.strip()

            return report