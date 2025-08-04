import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
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
    const result = runPython(
      "import json\nfrom language_learning.goals import load_default_goals\nprint(json.dumps([g.__dict__ for g in load_default_goals()]))",
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
  const result = runPython(
    "import json\nfrom language_learning.goals import load_default_goals\nprint(json.dumps([g.word for g in load_default_goals()]))",
  );
  return result || [];
}
