import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { ThemeProvider, useTheme } from './ThemeContext.jsx';

expect.extend(matchers);

function ThemeToggleButton() {
  const { toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Toggle</button>;
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const style = document.createElement('style');
    style.innerHTML = `
      :root { --color-bg: #F6F6F6; }
      [data-theme='dark'] { --color-bg: #121212; }
    `;
    document.head.appendChild(style);
  });

  test('toggleTheme updates data-theme attribute and CSS variables', async () => {
    render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>
    );
    const html = document.documentElement;

    await waitFor(() => expect(html.getAttribute('data-theme')).toBe('light'));
    const lightBg = getComputedStyle(html).getPropertyValue('--color-bg').trim();
    expect(lightBg).toBe('#F6F6F6');

    screen.getByText('Toggle').click();

    await waitFor(() => expect(html.getAttribute('data-theme')).toBe('dark'));
    const darkBg = getComputedStyle(html).getPropertyValue('--color-bg').trim();
    expect(darkBg).toBe('#121212');
  });
});
