from unittest.mock import MagicMock
from runtime.data.aws_cognito import CognitoIdentityProvider

class MockIdentityProvider(CognitoIdentityProvider):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.cognito_idp_client = MockBoto3CognitoClient()
    


class MockBoto3CognitoClient(MagicMock):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._user = DEFAULT_USER

    def sign_up(self, *args, **kwargs):
        self._user = kwargs
        return {}


    def admin_confirm_sign_up(self, *args, **kwargs):
        return {}
    
    def admin_get_user(self, *args, **kwargs):
        print("---------------------------")
        print("admin_get_user", kwargs)        
        print("---------------------------")

        return self._user
    
    def initiate_auth(self, **kwargs):
        return {
            'ChallengeName': "PASSWORD",
            'Session': 'xxx',
            'ChallengeParameters': {
                'xxx': 'xxx'
            },
            'AuthenticationResult': {
                'AccessToken': 'xxx',
                'ExpiresIn': 123,
                'TokenType': 'xxx',
                'RefreshToken': 'xxx',
                'IdToken': 'xxx',
                'NewDeviceMetadata': {
                    'DeviceKey': 'xxx',
                    'DeviceGroupKey': 'xxx'
                }
            },
            'AvailableChallenges': []
        }
    
    
    def get_user(self, UserPoolId, Username):
        self._user['Username'] = Username
        return self._user
    
    def list_users(self, UserPoolId, Filter):
        return {
            'Users': [self._user],
            "PaginationToken": "xxx"
        }
    
    def admin_update_user_attributes(self, UserPoolId , Username, UserAttributes):
        self._user['UserAttributes'] = UserAttributes
        return {}

DEFAULT_USER = {
    'Username': "",
    'UserAttributes': [
        { "Name": "email", "Value": "" },
        { "Name": "gender", "Value": "" },
        { "Name": "birthdate", "Value": "yyyy-mm-dd" },
        { "Name": "custom:first_name", "Value": "" },
        { "Name": "custom:last_name", "Value": "" },
        { "Name": "custom:occupation", "Value": "default_occupation" },
        { "Name": "custom:organization", "Value": "default_organization" },
        { "Name": "custom:location", "Value": "default_location" },
        { "Name": "custom:is_doctor", "Value": "false" },
        { "Name": "custom:doctor_id", "Value": "default_doctor_id" },
        { "Name": "name", "Value": "default_doctor_id" },
    ],
    'MFAOptions': [],
    'PreferredMfaSetting': 'xxx',
    'UserMFASettingList': []
}