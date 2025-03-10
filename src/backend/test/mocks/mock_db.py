from unittest.mock import MagicMock
from runtime.data.aws_dynamodb.medical_record_service import MedicalRecordService
from runtime.data.aws_dynamodb.medical_prescription_service import MedicalPrescriptionService
from runtime.data.aws_dynamodb.base_service import BaseDynamoService

class MockBaseDynamoService(MagicMock):
    def __init__(self, table_name, region_name="us-west-2"):
        super().__init__(table_name, region_name)

    def get_item_by_id(self, uuid):
        return {"id": uuid}

    def create_new_item(self, item):
        item["id"] = "xxxxxx"
        return item

    def update_item_by_id(self, uuid, updated_item):
        updated_item["id"] = uuid
        return updated_item

class MockMedicalRecordService(MagicMock):
    def __init__(self, table_name, region_name="us-west-2"):
        super().__init__(table_name, region_name)

    def get_paginated_record_by_userId(self, userId, limit, cursor=None):
        return {"data": [{"userId": userId}], "next": None}

    def get_record_by_id(self, uuid):
        record = {}
        return record

    def create_new_record(self, userId):
        record = {}
        return record

    def update_record_by_id(self, uuid):
        record = {}
        return record

    def link_report_to_record(self, recordId, reportId):
        return {"Attributes": 'xxxxxx'}
    
class MockMedicalPrescriptionService(MagicMock):
    def __init__(self, table_name, region_name="us-west-2"):
        super().__init__(table_name, region_name)

    def get_paginated_prescription_by_recordId(self, recordId, limit, cursor=None):
        return {"data": [{"recordId": recordId}], "next": None}

    def get_prescription_by_id(self, uuid):
        return {"id": uuid}

    def create_new_prescription(self, recordId):
        prescription = {}
        return prescription
    
    def update_prescription_by_id(self, uuid):
        prescription = {}
        return prescription