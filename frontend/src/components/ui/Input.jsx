import React from 'react';

export default function Input({ as = 'input', className = '', ...props }) {
  const Component = as;
  const base =
    'border rounded p-xs focus:outline focus:outline-2 focus:outline-offset-2 focus:shadow-[0_0_0_3px_rgba(255,191,50,0.3)]';
  return <Component className={`${base} ${className}`} {...props} />;
}
