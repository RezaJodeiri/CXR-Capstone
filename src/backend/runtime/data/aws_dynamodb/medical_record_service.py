from .base_service import BaseDynamoService


class MedicalRecordService(BaseDynamoService):
    def __init__(self, table_name, region_name="us-west-2"):
        super().__init__(table_name, region_name)

    def get_record_by_id(self, uuid):
        return super().get_item_by_id(uuid)

    def create_new_record(self, record):
        return super().put_item(record)

    def update_record_by_id(self, uuid, record):
        return super().update_item_by_id(uuid, record)
