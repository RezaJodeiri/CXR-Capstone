from src.backend.runtime.config import Config
from src.backend.runtime.data.aws_cognito import CognitoIdentityProvider
from src.backend.runtime.data.aws_dynamodb.medical_record_service import MedicalRecordService as MRS
from src.backend.runtime.data.aws_dynamodb.medical_prescription_service import MedicalPrescriptionService as MPS
from src.backend.runtime.data.report_generation_service import ReportGenerationService as RGS

# Create classes for the services

RuntimeConfig = Config()
IdentityProvider = CognitoIdentityProvider(
    user_pool_id=RuntimeConfig.get("COGNITO_USER_POOL_ID"),
    client_id=RuntimeConfig.get("COGNITO_APP_CLIENT_ID"),
    client_secret=RuntimeConfig.get("COGNITO_APP_CLIENT_SECRET"),
)

MedicalRecordService = MRS("capstone_medical_record", "us-west-2")
MedicalPrescriptionService = MPS("capstone_medical_prescription", "us-west-2")
ReportGenerationService = RGS()

# Test Class for MedicalRecordService
class TestMedicalRecordService:
    def test_get_paginated_record_by_userId(self):
        user_id = None
        limit = None

        response = MedicalRecordService.get_paginated_record_by_userId(user_id, limit)
        assert response is not None

    def test_get_record_by_id(self):
        uuid = None

        response = MedicalRecordService.get_record_by_id(uuid)
        assert response is not None

    def test_create_new_record(self):
        user_id = None
        record = {}
        record["UserId"] = user_id

        response = MedicalRecordService.create_new_record(user_id, record)
        assert response is not None

    def test_update_record_by_id(self):
        uuid = None
        record = {}

        response = MedicalRecordService.update_record_by_id(uuid, record)
        assert response is not None

    def test_link_report_to_record(self):
        record_id = None
        report_id = None

        response = MedicalRecordService.link_report_to_record(record_id, report_id)
        assert response is not None

# Test Class for MedicalPrescriptionService
class TestMedicalPrescriptionService:
    def test_get_paginated_prescription_by_recordId(self):
        record_id = None
        limit = None

        response = MedicalPrescriptionService.get_paginated_prescription_by_recordId(record_id, limit)
        assert response is not None

    def test_get_prescription_by_id(self):
        uuid = None

        response = MedicalPrescriptionService.get_prescription_by_id(uuid)
        assert response is not None

    def test_create_new_prescription(self):
        record_id = None
        prescription = {}

        response = MedicalPrescriptionService.create_new_prescription(record_id, prescription)
        assert response is not None

    def test_update_prescription_by_id(self):
        uuid = None
        prescription = {}

        response = MedicalPrescriptionService.update_prescription_by_id(uuid, prescription)
        assert response is not None

# Test Class for ReportGenerationService
class TestReportGenerationService:
    def test_generate_report(self):
        user_id = None
        ImageUrl = None

        response = ReportGenerationService.generate_report(user_id, ImageUrl)
        assert response is not None