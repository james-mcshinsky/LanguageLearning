import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [stats, setStats] = useState({ streak: 0, lingots: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function loadStats() {
      try {
        const res = await fetch('/api/user/stats');
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        if (!ignore) {
          setStats({
            streak: data.streak ?? 0,
            lingots: data.lingots ?? 0,
          });
        }
      } catch (err) {
        if (!ignore) {
          setError('Unable to load stats');
        }
      }
    }
    loadStats();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-bold">Stats</h2>
        {error && (
          <p role="alert" className="text-red-500">
            {error}
          </p>
        )}
        <div className="space-y-1" aria-live="polite">
          <div className="streak">🔥 {stats.streak}</div>
          <div className="lingots">💎 {stats.lingots}</div>
        </div>
      </div>
    </div>
  );
}
