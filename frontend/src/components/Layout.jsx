import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const navItems = [
  { path: '/', label: 'Onboarding' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/learn', label: 'Learn' },
  { path: '/media', label: 'Media' },
  { path: '/goals', label: 'Goals' },
  { path: '/analytics', label: 'Analytics' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toggleTheme } = useTheme();

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr] md:grid-cols-[16rem,1fr] grid-cols-1">
      <header className="bg-secondary text-primary p-4 flex justify-between items-center md:col-span-2">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
            className="p-2 rounded md:hidden hover:bg-white/5 focus:bg-white/5 focus:outline-none"
          >
            <span className="block w-6 h-0.5 bg-current" />
            <span className="block w-6 h-0.5 bg-current my-1" />
            <span className="block w-6 h-0.5 bg-current" />
          </button>
          <nav className="flex space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-2 py-1 rounded hover:bg-white/5 focus:bg-white/5 focus:outline-none ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded hover:bg-white/5 focus:bg-white/5 focus:outline-none"
        >
          Toggle Theme
        </button>
      </header>
      <aside
        className={`border-r border-white/10 p-4 ${
          sidebarOpen ? 'block' : 'hidden'
        } md:block`}
      >
        <Sidebar />
      </aside>
      <main className="p-4 overflow-y-auto">
        <section className="skill-path">{children}</section>
      </main>
    </div>
  );
}
