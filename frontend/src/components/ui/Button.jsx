import React from 'react';

const base = 'px-md py-sm rounded focus:outline focus:outline-2 focus:outline-offset-2';
const variants = {
  primary: 'bg-accent-primary text-inverse',
  secondary: 'bg-secondary text-text',
  outline: 'border',
};

export default function Button({ variant = 'primary', className = '', ...props }) {
  const styles = `${base} ${variants[variant] || ''} ${className}`;
  return <button className={styles} {...props} />;
}
