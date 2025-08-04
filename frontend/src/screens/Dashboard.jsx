import React, { useEffect, useState } from 'react';
import ProgressOverview from '../components/ProgressOverview.jsx';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [progress, setProgress] = useState({ learned: 0, total: 0 });
  const [next, setNext] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const [progressRes, nextRes] = await Promise.all([
          fetch('/analytics/progress'),
          fetch('/analytics/reviews/next'),
        ]);
        const progressData = await progressRes.json();
        const nextData = await nextRes.json();
        setProgress(progressData);
        setNext(nextData.next || []);
      } catch (err) {
        setError('Unable to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div aria-live="polite">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <ProgressOverview heading="Dashboard" progress={progress} next={next} />
          <div className="px-4 pb-4 mt-4 flex flex-col gap-4">
            <Button onClick={() => navigate('/learn')}>Work with AI Tutor</Button>
            <Button onClick={() => navigate('/media')}>Browse Media</Button>
          </div>
        </>
      )}
    </div>
  );
}
