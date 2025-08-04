import React, { useEffect, useState } from 'react';
import ProgressOverview from '../components/ProgressOverview.jsx';

export default function GoalView() {
  const [progress, setProgress] = useState({ learned: 0, total: 0 });
  const [next, setNext] = useState([]);

  useEffect(() => {
    fetch('/analytics/progress')
      .then((r) => r.json())
      .then((data) => setProgress(data))
      .catch(() => {});
    fetch('/analytics/reviews/next')
      .then((r) => r.json())
      .then((data) => setNext(data.next || []))
      .catch(() => {});
  }, []);

  return <ProgressOverview heading="Goal View" progress={progress} next={next} />;
}
