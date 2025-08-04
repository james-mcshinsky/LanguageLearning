import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import ProgressOverview from './ProgressOverview.jsx';

expect.extend(matchers);

describe.each([
  [{ learned: 0, total: 0 }, '0/0', 0],
  [{ learned: 5, total: 10 }, '5/10', 50],
  [{ learned: 10, total: 10 }, '10/10', 100],
])('ProgressOverview', (progress, fraction, pct) => {
  test(`renders progress ${pct}%`, () => {
    render(<ProgressOverview heading="Test" progress={progress} next={[]} />);
    expect(screen.getByText(fraction)).toBeInTheDocument();
    const bar = screen.getByText(`${pct}%`);
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveStyle(`width: ${pct}%`);
  });
});
