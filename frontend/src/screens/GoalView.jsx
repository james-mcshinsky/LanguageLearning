import React, { useEffect, useState } from 'react';
import { fetchGoals, addGoal, deleteGoal } from '../services/api.js';

export default function GoalView() {
  const [goals, setGoals] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newWord, setNewWord] = useState('');

  const loadGoals = () => {
    fetchGoals()
      .then((data) => setGoals(data.goals || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleAdd = async () => {
    if (!newWord.trim()) return;
    await addGoal(newWord.trim());
    setNewWord('');
    setShowInput(false);
    loadGoals();
  };

  const handleDelete = async (word) => {
    await deleteGoal(word);
    loadGoals();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Goals</h1>
      <ul>
        {goals.map((g) => (
          <li key={g.word} className="mb-2 flex items-center gap-2">
            <span>{g.word}</span>
            {g.is_default && <span className="text-gray-500">(default)</span>}
            <button
              className="ml-auto text-red-500"
              onClick={() => handleDelete(g.word)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      {showInput ? (
        <div className="mt-4 flex items-center gap-2">
          <input
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Add a word"
            className="border p-1"
          />
          <button
            className="bg-blue-500 text-white px-2 py-1"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          className="mt-4 bg-blue-500 text-white px-2 py-1"
          onClick={() => setShowInput(true)}
        >
          Add Goal
        </button>
      )}
    </div>
  );
}
