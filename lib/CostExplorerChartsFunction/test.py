import boto3

session = boto3.Session(profile_name='cevo-dev')
DynamoDbClient = session.client('dynamodb')

clientData = DynamoDbClient.get_item(
    TableName='CMSAutomationConfigsTable',
    Key={
        'id':{
            'S': 'CSI-LZ'
        }
    }
)

roleArn = [roleArn for roleArn in clientData['Item']['roleArn'].values()][0]
AWSAccountId=roleArn.split(":")[4]