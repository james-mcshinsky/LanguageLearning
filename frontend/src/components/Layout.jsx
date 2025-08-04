import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

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
    <div className="min-h-screen grid grid-rows-[auto,1fr] grid-cols-[16rem,1fr]">
      <header className="bg-secondary text-primary p-4 flex justify-between items-center col-span-2">
        <nav className="flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-2 py-1 rounded hover:bg-white/5 focus:bg-white/5 focus:outline-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleToggle}
          aria-label="Toggle theme"
          className="p-2 rounded hover:bg-white/5 focus:bg-white/5 focus:outline-none"
        >
          Toggle Theme
        </button>
      </header>
      <aside className="border-r border-white/10 p-4">
        <Sidebar />
      </aside>
      <main className="p-4 overflow-y-auto">
        <section className="skill-path">{children}</section>
      </main>
    </div>
  );
}
