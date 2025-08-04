import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Button from './ui/Button';

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
      <header className="bg-secondary text-primary p-md flex justify-between items-center md:col-span-2">
        <div className="flex items-center space-x-lg">
          <Button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
            aria-expanded={sidebarOpen}
            variant="secondary"
            className="md:hidden"
          >
            <span className="block w-6 h-0.5 bg-current" />
            <span className="block w-6 h-0.5 bg-current my-1" />
            <span className="block w-6 h-0.5 bg-current" />
          </Button>
          <nav className="flex space-x-lg">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-sm py-xs rounded hover:bg-white/5 focus:bg-white/5 focus:outline-none ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <Button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          variant="secondary"
        >
          Toggle Theme
        </Button>
      </header>
      <aside
        className={`border-r border-white/10 p-md bg-secondary fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:translate-x-0 md:w-auto md:block`}
      >
        <Sidebar />
      </aside>
      <main className="p-md overflow-y-auto">
        <section className="skill-path">{children}</section>
      </main>
    </div>
  );
}
