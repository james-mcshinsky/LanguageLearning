import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import Sidebar from './Sidebar.jsx';

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
  });

  test('fetches and displays user stats', async () => {
    const { container } = render(<Sidebar />);
    expect(fetch).toHaveBeenCalledWith('/api/user/stats');
    await waitFor(() => {
      expect(screen.getByText('Streak')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Lingots')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
    });
    const dl = container.querySelector('dl');
    expect(dl).toHaveAttribute('aria-live', 'polite');
  });
});
