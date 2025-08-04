import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import Sidebar from './Sidebar.jsx';
import { MemoryRouter } from 'react-router-dom';

expect.extend(matchers);

describe('Sidebar', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ streak: 3, lingots: 7 }),
      })
    ));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  test('fetches and displays user stats', async () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    expect(fetch).toHaveBeenCalledWith('/api/user/stats');
    await waitFor(() => {
      expect(screen.getByText('Stats')).toBeInTheDocument();
      expect(screen.getByText('🔥 3')).toBeInTheDocument();
      expect(screen.getByText('💎 7')).toBeInTheDocument();
    });
    const statsContainer = container.querySelector('[aria-live="polite"]');
    expect(statsContainer).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /goals/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /vocabulary/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /analytics/i })).not.toBeInTheDocument();
  });

  test('includes link to vocabulary page', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    const vocabLink = screen.getByRole('link', { name: /vocabulary/i });
    expect(vocabLink).toBeInTheDocument();
    expect(vocabLink).toHaveAttribute('href', '/vocabulary');
  });
});
