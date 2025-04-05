"""
Author: Nathan Luong
"""

from .base_service import BaseDynamoService
from boto3.dynamodb.conditions import Key


class MedicalPrescriptionService(BaseDynamoService):
    def __init__(self, table_name, region_name="us-west-2"):
        super().__init__(table_name, region_name)

    def get_paginated_prescription_by_recordId(self, recordId, limit, cursor=None):
        kwargs = {
            "IndexName": "recordId-index",
            "KeyConditionExpression": Key("recordId").eq(recordId),
            "Limit": limit,
            "ScanIndexForward": False,  # Sort by createdDate in descending order
        }
        if cursor:
            kwargs["ExclusiveStartKey"] = {"recordId": recordId, "id": cursor}
        response = self.table.query(**kwargs)
        nextCursor = response.get("LastEvaluatedKey", None)
        return {
            "data": response.get("Items", []),
            "next": nextCursor["id"] if nextCursor else None,
        }

    def get_prescription_by_id(self, uuid):
        return super().get_item_by_id(uuid)

    def create_new_prescription(self, recordId, prescription):
        prescription["recordId"] = recordId
        return super().create_new_item(prescription)

    def update_prescription_by_id(self, uuid, prescription):
        return super().update_item_by_id(uuid, prescription)
