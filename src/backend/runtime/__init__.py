from .config import Config
from .data.aws_cognito import CognitoIdentityProvider
from .data.prediction_services import PredictionService as PS
from .data.aws_dynamodb.medical_record_service import MedicalRecordService as MRS
from .data.aws_dynamodb.medical_prescription_service import MedicalPrescriptionService as MPS
from .data.report_generation_service import ReportGenerationService as RGS
from .data.aws_s3 import S3PresignedURLHandler as s3
from .logger import Logger

RuntimeConfig = Config()

IdentityProvider = CognitoIdentityProvider(
    user_pool_id=RuntimeConfig.get("COGNITO_USER_POOL_ID"),
    client_id=RuntimeConfig.get("COGNITO_APP_CLIENT_ID"),
    client_secret=RuntimeConfig.get("COGNITO_APP_CLIENT_SECRET"),
)

PredictionService = PS()
MedicalRecordService = MRS("capstone_medical_record", "us-west-2")
MedicalPrescriptionService = MPS("capstone_medical_prescription", "us-west-2")
ReportGenerationService = RGS()
S3PresignedURLHandler = s3('neuralanalyzer-xrays')

RuntimeLogger = Logger().getLogger()
