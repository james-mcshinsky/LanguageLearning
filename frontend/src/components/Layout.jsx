import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Button from './ui/Button';

const navItems = [{ path: '/dashboard', label: 'Dashboard' }];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toggleTheme } = useTheme();

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr,auto]">
      <header className="site-header">
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
      <main className="page-content grid md:grid-cols-[16rem,1fr]">
        <aside
          className={`sidebar ${sidebarOpen ? '' : '-translate-x-full'} md:translate-x-0`}
        >
          <Sidebar />
        </aside>
        <section className="skill-path">{children}</section>
      </main>
      <footer className="site-footer">
        <nav className="flex justify-center space-x-md">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
        </nav>
      </footer>
    </div>
  );
}
