import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

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
      <nav aria-label="Secondary">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/onboarding"
              className={({ isActive }) =>
                `block px-xs py-xxs rounded hover:bg-white/5 focus:bg-white/5 focus:outline-none ${
                  isActive ? 'active' : ''
                }`
              }
            >
              Onboarding
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/goals"
              className={({ isActive }) =>
                `block px-xs py-xxs rounded hover:bg-white/5 focus:bg-white/5 focus:outline-none ${
                  isActive ? 'active' : ''
                }`
              }
            >
              Goals
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `block px-xs py-xxs rounded hover:bg-white/5 focus:bg-white/5 focus:outline-none ${
                  isActive ? 'active' : ''
                }`
              }
            >
              Analytics
            </NavLink>
          </li>
        </ul>
      </nav>
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
