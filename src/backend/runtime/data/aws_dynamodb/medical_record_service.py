from .base_service import BaseDynamoService
from boto3.dynamodb.conditions import Key


class MedicalRecordService(BaseDynamoService):
    def __init__(self, table_name, region_name="us-west-2"):
        super().__init__(table_name, region_name)

    def get_paginated_record_by_userId(self, userId, limit, cursor=None):
        kwargs = {
            "IndexName": "userId-index",
            "KeyConditionExpression": Key("userId").eq(userId),
            "Limit": limit,
        }
        if cursor:
            kwargs["ExclusiveStartKey"] = {"userId": userId, "id": cursor}
        response = self.table.query(**kwargs)
        data = response.get("Items", [])
        data.sort(key=lambda x: x.get("updated_at", ""), reverse=True)

        nextCursor = response.get("LastEvaluatedKey", None)
        return {
            "data": data,
            "next": nextCursor["id"] if nextCursor else None,
        }

    def get_record_by_id(self, uuid):
        record = super().get_item_by_id(uuid)
        record["predictions"] = {
            key: float(value) for key, value in record["predictions"].items()
        }
        return record

    def create_new_record(self, userId, record):
        record["userId"] = userId
        record["predictions"] = {
            key: str(value) for key, value in record["predictions"].items()
        }
        return super().create_new_item(record)

    def update_record_by_id(self, uuid, record):
        return super().update_item_by_id(uuid, record)
