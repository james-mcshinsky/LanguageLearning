import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';

export default function Learn() {
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', isCorrect: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiClient('/lesson/queue');
        setQueue(data.queue || []);
      } catch (err) {
        setError('Unable to load lesson.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const current = queue[index];

  const sendReview = async (word, quality) => {
    try {
      setError(null);
      await apiClient('/lesson/review', {
        method: 'POST',
        body: { word, quality },
      });
    } catch (err) {
      setError('Failed to submit review.');
    }
  };

  const next = () => {
    setInput('');
    setIndex((i) => i + 1);
  };

  const handleMCQ = (choiceIdx) => {
    const correct = choiceIdx === current.answer_index;
    setFeedback({
      message: correct
        ? 'Correct!'
        : `Incorrect. Answer: ${current.choices[current.answer_index]}`,
      isCorrect: correct,
    });
    sendReview(current.word, correct ? 5 : 2);
    setTimeout(() => {
      setFeedback({ message: '', isCorrect: null });
      next();
    }, 1000);
  };

  const handleFillBlank = () => {
    const correct =
      input.trim().toLowerCase() === current.answer.toLowerCase();
    setFeedback({
      message: correct ? 'Correct!' : `Incorrect. Answer: ${current.answer}`,
      isCorrect: correct,
    });
    sendReview(current.word, correct ? 5 : 2);
    setTimeout(() => {
      setFeedback({ message: '', isCorrect: null });
      next();
    }, 1000);
  };

  const handleMatchingDrop = (opt) => {
    const correct = opt === current.answer;
    setFeedback({
      message: correct ? 'Correct!' : `Incorrect. Answer: ${current.answer}`,
      isCorrect: correct,
    });
    sendReview(current.word, correct ? 5 : 2);
    setTimeout(() => {
      setFeedback({ message: '', isCorrect: null });
      next();
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="p-4" aria-live="polite">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4" aria-live="polite">
        <p>{error}</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="p-4" aria-live="polite">
        <h1 className="text-2xl font-bold">Learn</h1>
        <p className="mt-4">No items due.</p>
      </div>
    );
  }

  return (
    <div className="p-4" aria-live="polite">
      <h1 className="text-2xl font-bold">Learn</h1>

      {current.type === 'mcq' && (
        <div className="mt-4">
          <p>{current.question}</p>
          {current.choices.map((c, idx) => (
            <button
              key={idx}
              onClick={() => handleMCQ(idx)}
              className="block mt-2 p-2 border rounded"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {current.type === 'fill_blank' && (
        <div className="mt-4">
          <p>{current.sentence}</p>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border p-1 mt-2"
          />
          <button
            onClick={handleFillBlank}
            className="ml-2 p-1 border rounded"
          >
            Submit
          </button>
        </div>
      )}

      {current.type === 'matching' && (
        <div className="mt-4">
          <p>Drag the word to its match:</p>
          <div className="flex space-x-4 mt-2">
            <div
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData('text/plain', current.word)
              }
              className="p-2 border rounded"
            >
              {current.word}
            </div>
            {current.options.map((opt) => (
              <div
                key={opt}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleMatchingDrop(opt)}
                className="p-2 border rounded"
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}

      {current.type === 'grammar_tip' && (
        <div className="mt-4">
          <p className="italic">{current.tip}</p>
          <button onClick={next} className="mt-2 p-1 border rounded">
            Next
          </button>
        </div>
      )}

      {feedback.message && (
        <p
          className={`mt-4 ${feedback.isCorrect ? 'text-accent-primary' : 'text-accent-secondary'}`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
}

