import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import Dashboard from './Dashboard.jsx';
import { MemoryRouter } from 'react-router-dom';

expect.extend(matchers);

describe('Dashboard', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ learned: 1, total: 2 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ next: ['alpha', 'beta'] }),
        })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  test('loads progress and next review words', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(fetch).toHaveBeenCalledWith(
      '/api/analytics/progress',
      expect.objectContaining({ method: 'GET' })
    );
    expect(fetch).toHaveBeenCalledWith(
      '/api/analytics/reviews/next',
      expect.objectContaining({ method: 'GET' })
    );
    await waitFor(() => {
      expect(screen.getByText('1/2')).toBeInTheDocument();
      expect(screen.getByText('alpha')).toBeInTheDocument();
      expect(screen.getByText('beta')).toBeInTheDocument();
    });
  });

  test('shows error when requests fail', async () => {
    fetch.mockReset();
    fetch
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ next: [] }),
      });
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Network request failed')).toBeInTheDocument();
    });
  });
});

