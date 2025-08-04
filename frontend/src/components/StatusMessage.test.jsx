import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import StatusMessage from './StatusMessage.jsx';

expect.extend(matchers);

describe('StatusMessage', () => {
  test('renders loading message with status role', () => {
    render(<StatusMessage type="loading" message="Loading..." />);
    const msg = screen.getByText('Loading...');
    expect(msg).toHaveAttribute('role', 'status');
  });

  test('renders error message with alert role', () => {
    render(<StatusMessage type="error" message="Error!" />);
    const msg = screen.getByRole('alert');
    expect(msg).toHaveTextContent('Error!');
  });
});
