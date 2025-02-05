from .config import Config
from .data.aws_cognito import CognitoIdentityProvider
from .data.prediction_services import PredictionService as PS
from .logger import Logger

RuntimeConfig = Config()

IdentityProvider = CognitoIdentityProvider(
    user_pool_id=RuntimeConfig.get("COGNITO_USER_POOL_ID"),
    client_id=RuntimeConfig.get("COGNITO_APP_CLIENT_ID"),
    client_secret=RuntimeConfig.get("COGNITO_APP_CLIENT_SECRET"),
)

PredictionService = PS()

RuntimeLogger = Logger().getLogger()
