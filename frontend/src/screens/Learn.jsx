import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import StatusMessage from '../components/StatusMessage.jsx';

export default function Learn() {
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [selectedMatch, setSelectedMatch] = useState('');
  const [feedback, setFeedback] = useState({ message: '', isCorrect: null });
  const [animateFeedback, setAnimateFeedback] = useState(false);
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
    setSelectedMatch('');
    setIndex((i) => i + 1);
  };

  const showFeedback = (message, correct) => {
    setFeedback({ message, isCorrect: correct });
    setAnimateFeedback(false);
    setTimeout(() => setAnimateFeedback(true), 0);
  };

  const handleMCQ = (choiceIdx) => {
    const correct = choiceIdx === current.answer_index;
    showFeedback(
      correct
        ? 'Correct!'
        : `Incorrect. Answer: ${current.choices[current.answer_index]}`,
      correct
    );
    sendReview(current.word, correct ? 5 : 2);
    setTimeout(() => {
      setFeedback({ message: '', isCorrect: null });
      setAnimateFeedback(false);
      next();
    }, 1000);
  };

  const handleFillBlank = () => {
    const correct =
      input.trim().toLowerCase() === current.answer.toLowerCase();
    showFeedback(
      correct ? 'Correct!' : `Incorrect. Answer: ${current.answer}`,
      correct
    );
    sendReview(current.word, correct ? 5 : 2);
    setTimeout(() => {
      setFeedback({ message: '', isCorrect: null });
      setAnimateFeedback(false);
      next();
    }, 1000);
  };

  const handleMatchingAnswer = (opt) => {
    const correct = opt === current.answer;
    showFeedback(
      correct ? 'Correct!' : `Incorrect. Answer: ${current.answer}`,
      correct
    );
    sendReview(current.word, correct ? 5 : 2);
    setTimeout(() => {
      setFeedback({ message: '', isCorrect: null });
      setAnimateFeedback(false);
      next();
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="p-s">
        <StatusMessage type="loading" message="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-s">
        <StatusMessage type="error" message={error} />
      </div>
    );
  }

  if (!current) {
    return (
      <div className="p-s" aria-live="polite">
        <h1 className="text-2xl font-bold">Learn</h1>
        <p className="mt-s">No items due.</p>
      </div>
    );
  }

  return (
    <div className="p-s" aria-live="polite">
      <h1 className="text-2xl font-bold">Learn</h1>

      {current.type === 'mcq' && (
        <Card className="mt-s">
          <p id="mcq-question">{current.question}</p>
          <div
            role="radiogroup"
            aria-labelledby="mcq-question"
            aria-describedby="mcq-instructions"
          >
            {current.choices.map((c, idx) => (
              <Button
                key={idx}
                role="radio"
                aria-checked="false"
                onClick={() => handleMCQ(idx)}
                variant="outline"
                className="block mt-xs w-full text-left"
              >
                {c}
              </Button>
            ))}
          </div>
          <p id="mcq-instructions" className="text-sm text-gray-600">
            Use Tab to focus an answer and Enter to select.
          </p>
        </Card>
      )}

      {current.type === 'fill_blank' && (
        <Card className="mt-s">
          <p id="fill-sentence">{current.sentence}</p>
          <label htmlFor="fill-input" className="block mt-2">
            Your answer
          </label>
          <Input
            id="fill-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-labelledby="fill-sentence"
          />
          <Button onClick={handleFillBlank} className="ml-xs mt-xs" variant="outline">
            Submit
          </Button>
        </Card>
      )}

      {current.type === 'matching' && (
        <Card className="mt-s">
          <p id="match-instructions">
            Drag the word to its match or select an answer below:
          </p>
          <div className="flex space-x-4 mt-2" aria-describedby="match-instructions">
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
                onDrop={() => handleMatchingAnswer(opt)}
                className="p-2 border rounded"
              >
                {opt}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label htmlFor="match-select" className="block">
              Choose the correct match for {current.word}
            </label>
            <Input
              as="select"
              id="match-select"
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && selectedMatch) {
                  handleMatchingAnswer(selectedMatch);
                }
              }}
              className="mt-xs"
            >
              <option value="">Select an option</option>
              {current.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Input>
            <Button
              onClick={() => handleMatchingAnswer(selectedMatch)}
              disabled={!selectedMatch}
              className="ml-xs mt-xs"
              variant="outline"
            >
              Submit
            </Button>
          </div>
        </Card>
      )}

      {current.type === 'grammar_tip' && (
        <Card className="mt-s">
          <p className="italic">{current.tip}</p>
          <Button onClick={next} className="mt-xs" variant="outline">
            Next
          </Button>
        </Card>
      )}

      {feedback.message && (
        <div
          key={index}
          className={`mt-s flex items-center p-xs rounded transition-all duration-300 transform ${
            animateFeedback
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2'
          } ${
            feedback.isCorrect ? 'bg-success' : 'bg-danger'
          } text-inverse`}
        >
          <span className="mr-2" aria-hidden="true">
            {feedback.isCorrect ? '✅' : '❌'}
          </span>
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
}

