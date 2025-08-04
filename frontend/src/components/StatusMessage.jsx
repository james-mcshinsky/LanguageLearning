import React from 'react';

export default function StatusMessage({ type = 'loading', message }) {
  const role = type === 'error' ? 'alert' : 'status';
  const styles =
    type === 'error' ? 'text-red-500' : 'text-gray-600';
  return (
    <p role={role} className={styles}>
      {message}
    </p>
  );
}
