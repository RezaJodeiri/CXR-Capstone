from runtime import IdentityProvider

class TestCognitoIdentityProvider():
    def test_sign_up_doctor(self):
        password = "test123!"
        user_email = "doctor@example.com"
        user_detail = {
            "first_name": "John",
            "last_name": "Doe",
            "gender": "male",
            "birthdate": "1980-01-01",
            "occupation": "Doctor",
            "organization": "Health Org",
            "location": "City",
        }

        user = IdentityProvider.sign_up_doctor(user_email, password, user_detail)
        print("---------------------------")
        print("user", str(user))
        print("---------------------------")
        assert user["email"] == user_email
        assert user["first_name"] == user_detail["first_name"]
        assert user["last_name"] == user_detail["last_name"]
        assert user["occupation"] == user_detail["occupation"]
        assert user["organization"] == user_detail["organization"]
        assert user["location"] == user_detail["location"]
        assert user["is_doctor"] == True

        # result = self.cognito_provider.sign_up_doctor(user_email, password, user_detail)

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