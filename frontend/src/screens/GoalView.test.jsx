import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import {
  describe,
  test,
  expect,
  vi,
  afterEach,
} from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import GoalView from './GoalView.jsx';
import { MemoryRouter } from 'react-router-dom';

expect.extend(matchers);

describe('GoalView', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  test('COCA defaults appear on initial load', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ goals: [{ word: 'alpha', is_default: true }] }),
      })
    );
    render(
      <MemoryRouter>
        <GoalView />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('alpha')).toBeInTheDocument();
      expect(screen.getByText('(default)')).toBeInTheDocument();
    });
  });

  test('"Remove" deletes a goal', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ goals: [{ word: 'alpha' }] }),
        })
        .mockResolvedValueOnce({ ok: true, status: 204 })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ goals: [] }),
        })
    );
    render(
      <MemoryRouter>
        <GoalView />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('alpha'));
    fireEvent.click(screen.getByRole('button', { name: /remove/i }));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/goals/alpha',
        expect.objectContaining({ method: 'DELETE' })
      );
      expect(screen.queryByText('alpha')).not.toBeInTheDocument();
    });
  });

  test('"Add Goal" posts a new word and updates the list', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ goals: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ goals: [{ word: 'beta' }] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ goals: [{ word: 'beta' }] }),
        })
    );
    render(
      <MemoryRouter>
        <GoalView />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Add Goal'));
    fireEvent.change(screen.getByPlaceholderText('Add a word'), {
      target: { value: 'beta' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Add$/ }));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/goals',
        expect.objectContaining({ method: 'POST' })
      );
      expect(screen.getByText('beta')).toBeInTheDocument();
    });
  });
});

