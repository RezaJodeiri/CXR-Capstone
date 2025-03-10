from unittest.mock import MagicMock

class MockBaseDynamoService(MagicMock):
    def __init__(self, table_name, region_name="us-west-2"):
        super().__init__()
        self.table_name = table_name
        self.region_name = region_name

    def get_item_by_id(self, uuid):
        return {"Item": {"id": uuid, "name": "Test Item"}}
    
    def create_new_item(self, item):
        item["id"] = "xxxxxx"
        return {"Item": item}

    def update_item_by_id(self, uuid, updated_item):
        updated_item["id"] = uuid
        return {"Attributes": updated_item}


class MockMedicalRecordService(MagicMock):
    def __init__(self, table_name, region_name="us-west-2"):
        super().__init__()
        self.table_name = table_name
        self.region_name = region_name

    def get_paginated_record_by_userId(self, userId, limit, cursor=None):
        return {"Items": [{"userId": userId}], "NextCursor": None}

    def get_record_by_id(self, uuid):
        return {"Item": {"id": uuid, "recordData": "Test record data"}}

    def create_new_record(self, userId, record):
        record["userId"] = userId
        return {"Item": record}

    def update_record_by_id(self, uuid, updated_data):
        updated_data["id"] = uuid
        return {"Attributes": updated_data}

    def link_report_to_record(self, recordId, reportId):
        return {"Attributes": {"recordId": recordId, "reportId": reportId}}


class MockMedicalPrescriptionService(MagicMock):
    def __init__(self, table_name, region_name="us-west-2"):
        super().__init__()
        self.table_name = table_name
        self.region_name = region_name

    def get_paginated_prescription_by_recordId(self, recordId, limit, cursor=None):
        return {"Items": [{"recordId": recordId}], "NextCursor": None}

    def get_prescription_by_id(self, uuid):
        return {"Item": {"id": uuid, "prescriptionData": "Test prescription data"}}

    def create_new_prescription(self, recordId, prescription):
        prescription["recordId"] = recordId
        return {"Item": prescription}

    def update_prescription_by_id(self, uuid, updated_data):
        updated_data["id"] = uuid
        return {"Attributes": updated_data}