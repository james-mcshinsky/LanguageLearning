import React from 'react';

export default function Input({ as = 'input', className = '', ...props }) {
  const Component = as;
  const base = 'border rounded p-sm focus:outline focus:outline-2 focus:outline-offset-2';
  return <Component className={`${base} ${className}`} {...props} />;
}
