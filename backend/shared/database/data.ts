import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { runPython } from '../utils';

const TABLE_NAME = process.env.DATA_TABLE || 'language-learning-data';
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const GOALS_KEY = 'goals';
const REVIEW_KEY = 'review_state';

export async function loadGoals(): Promise<{
  word: string;
  weight?: number;
  is_default?: boolean;
}[]> {
  const res = await dynamo.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { pk: GOALS_KEY } }),
  );
  let goals = Array.isArray(res.Item?.data) ? res.Item!.data : [];
  if (!goals.length) {
    const result = await runPython(
      'language_learning.entrypoints',
      ['default_goals'],
    );
    goals = result || [];
    if (goals.length) {
      await saveGoals(goals);
    }
  }
  return goals;
}

export async function saveGoals(goals: { word: string; weight?: number; is_default?: boolean }[]) {
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

// Load the default top 5 words from the bundled COCA list
export async function loadDefaultCocaWords(): Promise<string[]> {
  const result = await runPython(
    'language_learning.entrypoints',
    ['default_words'],
  );
  return result || [];
}

const USERS_PREFIX = 'user#';

export type UserRecord = {
  id: number;
  username: string;
  passwordHash: string;
};

export async function createUser(
  username: string,
  passwordHash: string,
): Promise<UserRecord> {
  const id = Date.now();
  const user: UserRecord = { id, username, passwordHash };
  await dynamo.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { pk: `${USERS_PREFIX}${id}`, data: user },
    }),
  );
  return user;
}

export async function getUserById(id: number): Promise<UserRecord | null> {
  const res = await dynamo.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { pk: `${USERS_PREFIX}${id}` } }),
  );
  return (res.Item?.data as UserRecord) || null;
}

export async function getUserByUsername(
  username: string,
): Promise<UserRecord | null> {
  const res = await dynamo.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'begins_with(pk, :prefix) AND data.username = :username',
      ExpressionAttributeValues: {
        ':prefix': USERS_PREFIX,
        ':username': username,
      },
      Limit: 1,
    }),
  );
  const item = res.Items?.[0];
  return (item?.data as UserRecord) || null;
}

export async function listUsers(): Promise<Omit<UserRecord, 'passwordHash'>[]> {
  const res = await dynamo.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'begins_with(pk, :prefix)',
      ExpressionAttributeValues: { ':prefix': USERS_PREFIX },
    }),
  );
  return (
    res.Items?.map((item) => {
      const { passwordHash, ...rest } = item.data as UserRecord;
      return rest;
    }) || []
  );
}

export async function saveUser(user: UserRecord) {
  await dynamo.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { pk: `${USERS_PREFIX}${user.id}`, data: user },
    }),
  );
}

export async function deleteUser(id: number) {
  await dynamo.send(
    new DeleteCommand({ TableName: TABLE_NAME, Key: { pk: `${USERS_PREFIX}${id}` } }),
  );
}
