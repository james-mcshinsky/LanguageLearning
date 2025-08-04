import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import Layout from './Layout.jsx';
import { ThemeProvider } from '../context/ThemeContext.jsx';

expect.extend(matchers);

describe('Layout', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ streak: 0, lingots: 0 })
      })
    ));
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  test('renders the logo in the header', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Layout>Child</Layout>
        </ThemeProvider>
      </MemoryRouter>
    );
    const logo = screen.getByAltText(/fluent milestones logo/i);
    expect(logo).toBeInTheDocument();
  });

  test('settings icon updates color when active', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Layout>Child</Layout>
        </ThemeProvider>
      </MemoryRouter>
    );
    const settingsButton = screen.getByLabelText(/open settings/i);
    const icon = settingsButton.querySelector('svg');
    expect(icon).toHaveClass('text-text-secondary');

    fireEvent.click(settingsButton);

    const updatedIcon = settingsButton.querySelector('svg');
    expect(updatedIcon).toHaveClass('text-accent');
  });
});
