import React, { useState } from 'react';
import { apiClient } from '../services/api';

const TEMPLATE_TEXT = {
  books: 'Read books in your target language to expand vocabulary and comprehension.',
  movies: 'Watch movies without subtitles to improve listening skills.',
  travel: 'Handle common travel tasks like ordering food or asking for directions.',
};

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [text, setText] = useState('');
  const [template, setTemplate] = useState('');
  const [vocab, setVocab] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleTemplate = (name) => {
    setTemplate(name);
    setText(TEMPLATE_TEXT[name]);
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setText(String(ev.target?.result || ''));
    reader.readAsText(file);
  };

  const startExtraction = async () => {
    const payload = text.trim();
    if (!payload) return;
    try {
      const result = await apiClient('/goals/extract', {
        method: 'POST',
        body: { text: payload },
      });
      setVocab(result.vocab || []);
      setSelected(result.vocab || []);
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const saveGoals = async () => {
    try {
      await apiClient('/goals/bulk', {
        method: 'POST',
        body: { items: selected.map((w) => ({ word: w })) },
      });
      setStep(3);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWord = (word) => {
    setSelected((cur) =>
      cur.includes(word) ? cur.filter((w) => w !== word) : [...cur, word]
    );
  };

  return (
    <div className="p-4">
      {step === 1 && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Choose your first goal</h1>
          <div className="space-x-2 mb-4">
            {Object.keys(TEMPLATE_TEXT).map((name) => (
              <button
                key={name}
                onClick={() => handleTemplate(name)}
                className={`px-3 py-1 border rounded ${
                  template === name ? 'bg-accent-primary text-inverse' : ''
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Or enter your own text"
            className="w-full border p-2 mb-2 h-40"
          />
          <input type="file" accept=".txt" onChange={handleFile} className="mb-4" />
          <div>
            <button
              onClick={startExtraction}
              className="bg-accent-primary text-inverse px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Select words to learn</h2>
          <ul className="mb-4">
            {vocab.map((word) => (
              <li key={word} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={selected.includes(word)}
                  onChange={() => toggleWord(word)}
                />
                <span className="ml-2">{word}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={saveGoals}
            className="bg-accent-primary text-inverse px-4 py-2 rounded"
          >
            Save Goals
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-2">Goals saved!</h2>
          <p>You are ready to start learning.</p>
        </div>
      )}
    </div>
  );
}
