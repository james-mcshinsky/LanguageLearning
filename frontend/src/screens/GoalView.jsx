import React, { useEffect, useState } from 'react';
import ProgressOverview from '../components/ProgressOverview.jsx';
import { apiClient } from '../services/api.js';

export default function GoalView() {
  const [progress, setProgress] = useState({ learned: 0, total: 0 });
  const [next, setNext] = useState([]);

  useEffect(() => {
    apiClient('/analytics/progress')
      .then((data) => setProgress(data))
      .catch(() => {});
    apiClient('/analytics/reviews/next')
      .then((data) => setNext(data.next || []))
      .catch(() => {});
  }, []);

  return <ProgressOverview heading="Goal View" progress={progress} next={next} />;
}
