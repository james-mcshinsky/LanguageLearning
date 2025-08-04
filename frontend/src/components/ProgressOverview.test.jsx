import { render, screen, cleanup } from '@testing-library/react';
import { describe, test, expect, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import ProgressOverview from './ProgressOverview.jsx';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

describe.each([
  [{ learned: 0, total: 0 }, '0/0', 0],
  [{ learned: 5, total: 10 }, '5/10', 50],
  [{ learned: 10, total: 10 }, '10/10', 100],
])('ProgressOverview', (progress, fraction, pct) => {
  test(`renders progress ${pct}%`, () => {
    render(<ProgressOverview heading="Test" progress={progress} next={[]} />);
    expect(screen.getByText(fraction)).toBeInTheDocument();
    const bar = screen.getByRole('progressbar');
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveTextContent(`${pct}%`);
    expect(bar).toHaveStyle(`width: ${pct}%`);
    expect(bar).toHaveAttribute('aria-valuenow', String(progress.learned));
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', String(progress.total));
  });
});
