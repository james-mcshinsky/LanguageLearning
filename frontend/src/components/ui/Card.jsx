import React from 'react';

export default function Card({ className = '', ...props }) {
  const base = 'bg-secondary text-text rounded shadow p-md';
  return <div className={`${base} ${className}`} {...props} />;
}
