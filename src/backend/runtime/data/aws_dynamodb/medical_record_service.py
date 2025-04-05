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
        nextCursor = response.get("LastEvaluatedKey", None)
        data = response.get("Items", [])
        for item in data:
            item.pop("report", None)
        return {
            "data": data,
            "next": nextCursor["id"] if nextCursor else None,
        }

    def get_record_by_id(self, uuid):
        return super().get_item_by_id(uuid)

    def create_new_record(self, userId, record):
        record["userId"] = userId
        return super().create_new_item(record)

    def update_record_by_id(self, uuid, record):
        return super().update_item_by_id(uuid, record)
    
    def link_report_to_record(self, recordId, reportId):
        return super().update_item_by_id(recordId, {"reportId": reportId})
