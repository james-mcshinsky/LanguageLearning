import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.DATA_TABLE || 'language-learning-data';
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const GOALS_KEY = 'goals';
const REVIEW_KEY = 'review_state';

export async function loadGoals() {
  const res = await dynamo.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { pk: GOALS_KEY } }),
  );
  return Array.isArray(res.Item?.data) ? res.Item!.data : [];
}

export async function saveGoals(goals: { word: string; weight?: number }[]) {
  await dynamo.send(
    new PutCommand({ TableName: TABLE_NAME, Item: { pk: GOALS_KEY, data: goals } }),
  );
}

export async function loadReviewState() {
  const res = await dynamo.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { pk: REVIEW_KEY } }),
  );
  return res.Item?.data || {};
}

export async function saveReviewState(state: Record<string, any>) {
  await dynamo.send(
    new PutCommand({ TableName: TABLE_NAME, Item: { pk: REVIEW_KEY, data: state } }),
  );
}
