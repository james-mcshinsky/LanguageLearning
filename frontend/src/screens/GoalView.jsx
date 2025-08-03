import React, { useEffect, useState } from 'react';

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

  const pct = progress.total ? Math.round((progress.learned / progress.total) * 100) : 0;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Goal View</h1>

      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span>Progress</span>
          <span>
            {progress.learned}/{progress.total}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded">
          <div
            className="bg-green-500 text-xs leading-none py-1 text-center text-white rounded"
            style={{ width: `${pct}%` }}
          >
            {pct}%
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Next words to review</h2>
        <ul className="list-disc pl-5">
          {next.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
