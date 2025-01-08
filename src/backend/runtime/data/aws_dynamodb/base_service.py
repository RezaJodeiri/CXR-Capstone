import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import uuid


class BaseDynamoService:
    def __init__(self, table_name, region_name="us-west-2"):
        self.dynamodb = boto3.resource("dynamodb", region_name=region_name)
        self.table = self.dynamodb.Table(table_name)

    def get_item_by_id(self, uuid):
        """
        Retrieve an item by its partition key.
        :param uuid: Value of the partition key.
        :return: Retrieved item or None if not found.
        """
        try:
            response = self.table.query(
                KeyConditionExpression=Key("id").eq(uuid),
            )
            if response.get("Items"):
                return response["Items"][0]  # Return the first item
            print(f"No items found with {"id"}={uuid}")
            return None
        except ClientError as e:
            print(f"Unable to get item: {e.response['Error']['Message']}")
            return None

    def create_new_item(self, item):
        """
        Insert or update an item in the table.
        :param item: Dictionary representing the item to put in the table.
        :return: The inserted item or False on failure.
        """
        try:
            self.table.put_item(Item=item)
            partition_key_value = str(uuid.uuid4())
            return self.get_item_by_id("id", partition_key_value)
        except ClientError as e:
            print(f"Unable to put item: {e.response['Error']['Message']}")
            return False

    def update_item_by_id(self, uuid, updated_item):
        """
        Update an item in the table by its partition key.
        :param p_key_name: Name of the partition key.
        :param uuid: Value of the partition key.
        :param updated_item: Dictionary of attributes to update.
        :return: The updated item or None on failure.
        """
        try:
            update_expression = "SET " + ", ".join(
                f"#{k} = :{k}" for k in updated_item.keys()
            )
            expression_attribute_names = {f"#{k}": k for k in updated_item.keys()}
            expression_attribute_values = {f":{k}": v for k, v in updated_item.items()}

            # Perform the update operation
            response = self.table.update_item(
                Key={"id": uuid},
                UpdateExpression=update_expression,
                ExpressionAttributeNames=expression_attribute_names,
                ExpressionAttributeValues=expression_attribute_values,
                ReturnValues="ALL_NEW",
            )

            return response.get("Attributes")  # Return the updated attributes
        except ClientError as e:
            print(f"Unable to update item: {e.response['Error']['Message']}")
            return None
