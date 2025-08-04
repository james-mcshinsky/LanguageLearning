import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Button from './ui/Button';
import UserSettings from './UserSettings.jsx';

const navItems = [{ path: '/dashboard', label: 'Dashboard' }];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr,auto]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-white focus:text-primary focus:px-s focus:py-xs focus:rounded"
      >
        Skip to main content
      </a>
      <header className="site-header">
        <div className="flex items-center space-x-m">
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
          <nav className="flex space-x-m">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-xs py-xxs rounded hover:bg-white/5 focus:bg-white/5 focus:outline-none ${
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
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
          variant="secondary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.088c1.543.94 1.031 3.28-.772 3.58a1.724 1.724 0 000 3.03c1.803.3 2.315 2.64.772 3.58a1.724 1.724 0 00-2.573 1.089c-.426 1.755-2.924 1.755-3.35 0a1.724 1.724 0 00-2.573-1.09c-1.543-.939-1.031-3.279.772-3.579a1.724 1.724 0 000-3.031c-1.803-.3-2.315-2.64-.772-3.58a1.724 1.724 0 002.573-1.088z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </Button>
      </header>
      {settingsOpen && (
        <UserSettings
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      <main
        id="main-content"
        className="page-content grid md:grid-cols-[16rem,1fr]"
      >
        <aside
          className={`sidebar ${sidebarOpen ? '' : '-translate-x-full'} md:translate-x-0`}
        >
          <Sidebar />
        </aside>
        <section className="skill-path">{children}</section>
      </main>
      <footer className="site-footer">
        <nav className="flex justify-center space-x-s">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
        </nav>
      </footer>
    </div>
  );
}
