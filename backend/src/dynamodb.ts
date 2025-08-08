import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const isOffline = process.env.AWS_SAM_LOCAL === 'true' || process.env.IS_OFFLINE === 'true';

const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: isOffline ? 'http://localhost:8000' : undefined,
});

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export default ddbDocClient;
