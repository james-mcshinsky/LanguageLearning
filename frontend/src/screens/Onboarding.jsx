import React, { useState } from 'react';
import { apiClient } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import StatusMessage from '../components/StatusMessage.jsx';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setIsLoading(true);
      setError(null);
      const result = await apiClient('/goals/extract', {
        method: 'POST',
        body: { text: payload },
      });
      setVocab(result.vocab || []);
      setSelected(result.vocab || []);
      setStep(2);
    } catch (err) {
      setError('Failed to extract vocabulary.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveGoals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await apiClient('/goals/bulk', {
        method: 'POST',
        body: { items: selected.map((w) => ({ word: w })) },
      });
      setStep(3);
    } catch (err) {
      setError('Failed to save goals.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWord = (word) => {
    setSelected((cur) =>
      cur.includes(word) ? cur.filter((w) => w !== word) : [...cur, word]
    );
  };

  return (
    <div className="p-s">
      {isLoading && (
        <StatusMessage type="loading" message="Loading..." />
      )}
      {error && <StatusMessage type="error" message={error} />}
      {step === 1 && (
        <Card>
          <h1 className="text-2xl mb-s">Choose your first goal</h1>
          <div
            className="space-x-xs mb-xs"
            role="group"
            aria-label="Goal templates"
            aria-describedby="template-instructions"
          >
            {Object.keys(TEMPLATE_TEXT).map((name) => (
              <Button
                key={name}
                variant={template === name ? 'primary' : 'outline'}
                onClick={() => handleTemplate(name)}
                aria-label={`Use ${name} template`}
                className="mr-xs"
              >
                {name}
              </Button>
            ))}
          </div>
          <p id="template-instructions" className="text-sm text-gray-600 mb-s">
            Use Tab to focus template buttons and Enter to select.
          </p>
          <label htmlFor="goal-text" className="block mb-xxs">
            Enter or paste your own text
          </label>
          <Input
            as="textarea"
            id="goal-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Or enter your own text"
            className="w-full mb-xs h-40"
          />
          <label htmlFor="goal-file" className="block mb-xxs">
            Upload a text file
          </label>
          <Input
            id="goal-file"
            type="file"
            accept=".txt"
            onChange={handleFile}
            className="mb-s"
          />
          <div>
            <Button onClick={startExtraction} disabled={isLoading}>
              Next
            </Button>
          </div>
        </Card>
      )}

        {step === 2 && (
        <Card>
          <h2 className="text-xl mb-s">Select words to learn</h2>
          <ul className="mb-s">
            {vocab.map((word, idx) => (
              <li key={word} className="mb-xxs">
                <label htmlFor={`word-${idx}`} className="flex items-center">
                  <input
                    id={`word-${idx}`}
                    type="checkbox"
                    checked={selected.includes(word)}
                    onChange={() => toggleWord(word)}
                    className="mr-xxs"
                  />
                  {word}
                </label>
              </li>
            ))}
          </ul>
          <Button onClick={saveGoals} disabled={isLoading}>
            Save Goals
          </Button>
        </Card>
      )}

        {step === 3 && (
        <Card>
          <h2 className="mb-xs">Goals saved!</h2>
          <p>You are ready to start learning.</p>
          <Card.Button className="mt-s">Start Learning</Card.Button>
        </Card>
      )}
    </div>
  );
}
