import unittest
from unittest.mock import patch, MagicMock
from runtime import IdentityProvider

class TestCognitoIdentityProvider(unittest.TestCase):
    def setUp(self):
        self.cognito_provider = IdentityProvider

    def test_sign_up_doctor(self):
        user_email = "doctor@example.com"
        password = "password123"
        user_detail = {
            "first_name": "John",
            "last_name": "Doe",
            "gender": "male",
            "birthdate": "1980-01-01",
            "occupation": "Doctor",
            "organization": "Health Org",
            "location": "City",
            "is_doctor": "true",
            "doctor_id": "doc123"
        }

        # result = self.cognito_provider.sign_up_doctor(user_email, password, user_detail)

        # mock_get_username_from_email.assert_called_once_with(user_email)
        # mock_sign_up_user.assert_called_once_with(user_email, password, user_detail)
        # mock_cognito_idp_client.admin_confirm_sign_up.assert_called_once_with(
        #     UserPoolId=self.cognito_provider.user_pool_id,
        #     Username="test_user"
        # )
        # self.assertEqual(result["Username"], "test_user")
        pass

    def test_create_patient(self):
        pass

    def test_sign_in_user(self):
        pass

    def test_get_self_user(self):
        pass

    def test_verify_token(self):
        pass

    def test_get_user_by_id(self):
        pass

    def test_update_user_by_id(self):
        pass

if __name__ == "__main__":
    unittest.main()