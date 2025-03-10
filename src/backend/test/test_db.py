import unittest
from .mocks.mock_db import MockMedicalRecordService as MRS, MockMedicalPrescriptionService as MPS

MedicalRecordService = MRS("capstone_medical_record", "us-west-2")
MedicalPrescriptionService = MPS("capstone_medical_prescription", "us-west-2")

# Test Class for MedicalRecordService
class TestMedicalRecordService(unittest.TestCase):
    def test_get_paginated_record_by_userId(self):
        user_id = '01cb4540-60e1-70da-ad16-eed4d8b556b8'
        limit = 10

        response = MedicalRecordService.get_paginated_record_by_userId(user_id, limit)
        assert response is not None

    def test_get_record_by_id(self):
        uuid = 'b00c5c6d-f6c8-435f-8bf7-9a27bcbccc26'

        response = MedicalRecordService.get_record_by_id(uuid)
        assert response is not None

    def test_create_new_record(self):
        user_id = '01cb4540-60e1-70da-ad16-eed4d8b556b8'
        record = {}
        record["UserId"] = user_id

        response = MedicalRecordService.create_new_record(user_id, record)
        assert response is not None

    def test_update_record_by_id(self):
        uuid = 'fe54793d-73e7-448a-8d4f-1a2161127b93'
        record = {"text": "xxxxxx"}

        response = MedicalRecordService.update_record_by_id(uuid, record)
        assert response is not None

    def test_link_report_to_record(self):
        record_id = 'b00c5c6d-f6c8-435f-8bf7-9a27bcbccc26'
        report_id = 'fe54793d-73e7-448a-8d4f-1a2161127b93'

        response = MedicalRecordService.link_report_to_record(record_id, report_id)
        assert response is not None

# Test Class for MedicalPrescriptionService
class TestMedicalPrescriptionService(unittest.TestCase):
    def test_get_paginated_prescription_by_recordId(self):
        record_id = 'b00c5c6d-f6c8-435f-8bf7-9a27bcbccc26'
        limit = 10

        response = MedicalPrescriptionService.get_paginated_prescription_by_recordId(record_id, limit)
        assert response is not None

    def test_get_prescription_by_id(self):
        uuid = 'ed5f8980-9895-4c72-947d-3761884dc3f2'

        response = MedicalPrescriptionService.get_prescription_by_id(uuid)
        assert response is not None

    def test_create_new_prescription(self):
        record_id = 'b00c5c6d-f6c8-435f-8bf7-9a27bcbccc26'
        prescription = {}

        response = MedicalPrescriptionService.create_new_prescription(record_id, prescription)
        assert response is not None

    def test_update_prescription_by_id(self):
        uuid = 'ed5f8980-9895-4c72-947d-3761884dc3f2'
        prescription = {"text": "xxxxxx"}

        response = MedicalPrescriptionService.update_prescription_by_id(uuid, prescription)
        assert response is not None