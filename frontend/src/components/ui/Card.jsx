import React from 'react';

export default function Card({ className = '', ...props }) {
  const base = 'bg-surface text-text rounded shadow p-md';
  return <div className={`${base} ${className}`} {...props} />;
}
