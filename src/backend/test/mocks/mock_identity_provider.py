from unittest.mock import MagicMock
from runtime.data.aws_cognito import CognitoIdentityProvider

class MockIdentityProvider(CognitoIdentityProvider):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.cognito_idp_client = MockBoto3CognitoClient()

    def delete_mock_user(self):
        self.cognito_idp_client._user = None
    
    def reset_mock(self):
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
        return self._user
    
    def initiate_auth(self, **kwargs):
        return {
            'ChallengeName': "PASSWORD",
            'Session': 'xxx',
            'ChallengeParameters': {
                'xxx': 'xxx'
            },
            'AuthenticationResult': {
                'AccessToken': 'xxxx',
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
    
    
    def get_user(self, AccessToken):
        return self._user
    
    def list_users(self, UserPoolId, Filter):
        self._user["Attributes"] = self._user["UserAttributes"]
        return {
            'Users': [self._user],
            "PaginationToken": "xxx"
        }
    
    def admin_update_user_attributes(self, UserPoolId , Username, UserAttributes):
        UserAttributes.append({"Name": "sub", "Value": "xxx"})
        UserAttributes.append({ "Name": "email_verified", "Value": "true" })
        self._user['UserAttributes'] = UserAttributes
        return {}

DEFAULT_USER = {
    'Username': "",
    'Enabled': "true",
    'UserCreateDate': "xxx",
    'UserLastModifiedDate': "xxx",
    'UserStatus': "CONFIRMED",
    'sub': "xxx",
    'UserAttributes': [
        { "Name": "email", "Value": "" },
        { "Name": "sub", "Value": "xxx" },
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
        { "Name": "email_verified", "Value": "true" },
    ],
    'MFAOptions': [],
    'PreferredMfaSetting': 'xxx',
    'UserMFASettingList': []
}