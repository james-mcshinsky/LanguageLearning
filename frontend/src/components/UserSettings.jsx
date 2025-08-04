import React, { useEffect, useRef } from 'react';
import Button from './ui/Button';
import { useTheme } from '../context/ThemeContext.jsx';

export default function UserSettings({ open, onClose }) {
  const { toggleTheme } = useTheme();
  const dialogRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    lastFocusedRef.current = document.activeElement;
    dialog.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        const focusableSelectors =
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
        const focusable = Array.from(
          dialog.querySelectorAll(focusableSelectors)
        ).filter((el) => !el.hasAttribute('disabled'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }

      if (e.key === 'Escape') {
        onClose();
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);
    return () => {
      dialog.removeEventListener('keydown', handleKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex="-1"
        className="bg-surface text-text rounded p-m shadow-lg w-11/12 max-w-md"
      >
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

