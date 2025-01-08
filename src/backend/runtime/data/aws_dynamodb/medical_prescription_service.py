from .base_service import BaseDynamoService


class MedicalPrescriptionService(BaseDynamoService):
    def __init__(self, table_name, region_name="us-west-2"):
        super().__init__(table_name, region_name)

    def get_prescription_by_id(self, uuid):
        return super().get_item_by_id(uuid)

    def create_new_prescription(self, prescription):
        return super().put_item(prescription)

    def update_prescription_by_id(self, uuid, prescription):
        return super().update_item_by_id(uuid, prescription)
