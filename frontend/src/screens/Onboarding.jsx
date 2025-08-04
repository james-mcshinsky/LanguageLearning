import React, { useState } from 'react';
import { apiClient } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

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
    <div className="p-md">
      <div aria-live="polite">
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
      </div>
        {step === 1 && (
        <Card>
          <h1 className="text-2xl mb-md">Choose your first goal</h1>
          <div
            className="space-x-sm mb-sm"
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
                className="mr-sm"
              >
                {name}
              </Button>
            ))}
          </div>
          <p id="template-instructions" className="text-sm text-gray-600 mb-md">
            Use Tab to focus template buttons and Enter to select.
          </p>
          <label htmlFor="goal-text" className="block mb-xs">
            Enter or paste your own text
          </label>
          <Input
            as="textarea"
            id="goal-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Or enter your own text"
            className="w-full mb-sm h-40"
          />
          <label htmlFor="goal-file" className="block mb-xs">
            Upload a text file
          </label>
          <Input
            id="goal-file"
            type="file"
            accept=".txt"
            onChange={handleFile}
            className="mb-md"
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
          <h2 className="text-xl mb-md">Select words to learn</h2>
          <ul className="mb-md">
            {vocab.map((word) => (
              <li key={word} className="flex items-center mb-xs">
                <input
                  type="checkbox"
                  checked={selected.includes(word)}
                  onChange={() => toggleWord(word)}
                  className="mr-xs"
                />
                <span>{word}</span>
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
          <h2 className="mb-sm">Goals saved!</h2>
          <p>You are ready to start learning.</p>
          <Card.Button className="mt-md">Start Learning</Card.Button>
        </Card>
      )}
    </div>
  );
}
