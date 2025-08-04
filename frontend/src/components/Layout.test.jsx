import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import Layout from './Layout.jsx';

expect.extend(matchers);

describe('Layout', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ streak: 0, lingots: 0 })
      })
    ));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  test('renders the logo in the header', () => {
    render(
      <MemoryRouter>
        <Layout>Child</Layout>
      </MemoryRouter>
    );
    const logo = screen.getByAltText(/fluent milestones logo/i);
    expect(logo).toBeInTheDocument();
  });
});
