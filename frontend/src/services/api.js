const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function apiClient(endpoint, { method = 'GET', body, headers } = {}) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'API request failed');
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export const fetchVocabulary = (corpus) =>
  apiClient('/lesson/vocabulary', {
    method: 'POST',
    body: { corpus },
  });

export const fetchLessonPrompts = (topic, newWords = [], reviewWords = []) =>
  apiClient('/lesson/prompts', {
    method: 'POST',
    body: { topic, new_words: newWords, review_words: reviewWords },
  });

export const generateBlurb = (
  knownWords = [],
  lPlusOneWords = [],
  length = 0,
) =>
  apiClient('/lesson/blurb', {
    method: 'POST',
    body: {
      known_words: knownWords,
      l_plus_one_words: lPlusOneWords,
      length,
    },
  });

export const fetchGoals = () => apiClient('/goals');

export const addGoal = (word, weight) =>
  apiClient('/goals', {
    method: 'POST',
    body: { word, ...(weight ? { weight } : {}) },
  });

export const deleteGoal = (word) =>
  apiClient(`/goals/${encodeURIComponent(word)}`, { method: 'DELETE' });
