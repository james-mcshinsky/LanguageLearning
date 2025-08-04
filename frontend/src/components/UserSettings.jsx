import React from 'react';
import Button from './ui/Button';
import { useTheme } from '../context/ThemeContext.jsx';

export default function UserSettings({ open, onClose }) {
  const { toggleTheme } = useTheme();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface text-text rounded p-m shadow-lg w-11/12 max-w-md">
        <div className="flex items-center justify-between mb-m">
          <h2 className="text-xl font-semibold">Settings</h2>
          <Button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            variant="secondary"
          >
            ✕
          </Button>
        </div>
        <div className="space-y-m">
          <div className="flex items-center justify-between">
            <span>Theme</span>
            <Button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              variant="secondary"
            >
              Toggle Theme
            </Button>
          </div>
          <div className="text-text-secondary">
            <p className="mb-s">Notifications settings coming soon</p>
            <p>Profile settings coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

