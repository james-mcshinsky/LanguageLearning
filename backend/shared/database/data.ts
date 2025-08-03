import fs from 'fs';
import path from 'path';

export const DATA_PATH = path.resolve(__dirname, '../../../data.json');

interface DataFile {
  goals: { word: string; weight?: number }[];
  review_state: Record<string, any>;
}

function readFile(): DataFile {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return {
      goals: Array.isArray(data.goals) ? data.goals : [],
      review_state: data.review_state || {},
    };
  } catch {
    return { goals: [], review_state: {} };
  }
}

function writeFile(data: DataFile) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data));
}

export function loadGoals() {
  return readFile().goals;
}

export function saveGoals(goals: { word: string; weight?: number }[]) {
  const data = readFile();
  data.goals = goals;
  writeFile(data);
}

export function loadReviewState() {
  return readFile().review_state;
}

export function saveReviewState(state: Record<string, any>) {
  const data = readFile();
  data.review_state = state;
  writeFile(data);
}
