import unittest
from runtime import IdentityProvider

class TestCognitoIdentityProvider(unittest.TestCase):
    def test_sign_up_doctor(self):
        IdentityProvider.delete_mock_user()
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
        assert user["Username"] == "doctor_example"
        assert user["Password"] == password

    def test_create_patient(self):
        IdentityProvider.delete_mock_user()
        patient_detail = {
            "name": "Nathan T Luong",
            "gender": "Male",
            "birthdate": "1980-01-01",
        }
        doctor_id = "123e4567-e89b-12d3-a456-426614174000"
        patient_email = "patient@example.com"

        new_patient = IdentityProvider.create_patient(
            doctor_id, patient_email, patient_detail
        )
        assert new_patient["Username"] == "patient_example"
        assert new_patient["Password"] == new_patient["Username"] + "_T2!"


    def test_sign_in_user(self):
        email = "doctor@example.com"
        password = "test123!"
        auth_result = IdentityProvider.sign_in_user(email, password)
        assert "AccessToken" in auth_result
        assert "RefreshToken" in auth_result
        assert "ExpiresIn" in auth_result

    def test_get_self_user(self):
        IdentityProvider.reset_mock()
        email = "doctor@example.com"
        password = "test123!"
        auth_result = IdentityProvider.sign_in_user(email, password)
        access_token = auth_result["AccessToken"]

        user_info = IdentityProvider.get_self_user(access_token)
        assert "email" in user_info
        assert "first_name" in user_info
        assert "last_name" in user_info
        assert "gender" in user_info
        assert "birthdate" in user_info
        assert "occupation" in user_info
        assert "organization" in user_info
        assert "location" in user_info

    def test_get_user_by_id(self):
        IdentityProvider.reset_mock()
        uuid = "123e4567-e89b-12d3-a456-426614174000"
        user = IdentityProvider.get_user_by_id(uuid)

        assert "id" in user
        assert "email" in user
        assert "first_name" in user
        assert "last_name" in user
        assert "gender" in user
        assert "birthdate" in user
        assert "occupation" in user
        assert "organization" in user
        assert "location" in user


    def test_update_user_by_id(self):
        IdentityProvider.reset_mock()
        uuid = "xxx"
        user_detail = {
            "first_name": "John",
            "last_name": "Doe",
            "occupation": "Developer",
            "organization": "SickKids Hospital",
            "location": "Toronto, Ontario, Canada",
            "is_doctor": "true",
        }
        updateResponse = IdentityProvider.update_user_by_id(uuid, user_detail)
        assert updateResponse["updated"] == "success"
        assert updateResponse["userId"] == "xxx"
        user = IdentityProvider.get_user_by_id(uuid)
        print(user)
        assert user["first_name"] == user_detail["first_name"]
        assert user["last_name"] == user_detail["last_name"]
        assert user["occupation"] == user_detail["occupation"]
        assert user["organization"] == user_detail["organization"]
        assert user["location"] == user_detail["location"]
        assert user["is_doctor"] == (user_detail["is_doctor"] == "true")
