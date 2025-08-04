import React from 'react';

export default function ProgressOverview({ heading, progress, next }) {
  const pct = progress.total ? Math.round((progress.learned / progress.total) * 100) : 0;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{heading}</h1>

      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span>Progress</span>
          <span>
            {progress.learned}/{progress.total}
          </span>
        </div>
        <div className="w-full bg-surface rounded">
          <div
            className="bg-success text-inverse text-xs leading-none py-1 text-center rounded"
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
