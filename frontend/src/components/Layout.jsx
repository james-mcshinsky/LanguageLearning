import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Onboarding' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/learn', label: 'Learn' },
  { path: '/media', label: 'Media' },
  { path: '/goals', label: 'Goals' },
  { path: '/analytics', label: 'Analytics' },
];

export default function Layout({ children }) {
  const handleToggle = () => {
    if (window.toggleTheme) {
      window.toggleTheme();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-secondary text-primary p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-2 py-1 rounded hover:bg-white/5 focus:bg-white/5 focus:outline-none"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={handleToggle}
          aria-label="Toggle theme"
          className="p-2 rounded hover:bg-white/5 focus:bg-white/5 focus:outline-none"
        >
          Toggle Theme
        </button>
      </nav>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
