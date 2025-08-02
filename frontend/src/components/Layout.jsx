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
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white p-4 flex space-x-4">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="hover:underline">
            {item.label}
          </Link>
        ))}
      </nav>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
