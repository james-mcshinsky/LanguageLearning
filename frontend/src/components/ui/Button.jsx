import React from 'react';

const base = 'px-md py-sm rounded focus:outline focus:outline-2 focus:outline-offset-2';
const variants = {
  primary: 'bg-primary text-text',
  secondary: 'bg-success text-inverse',
  outline: 'border',
};

export default function Button({ variant = 'primary', className = '', ...props }) {
  const styles = `${base} ${variants[variant] || ''} ${className}`;
  return <button className={styles} {...props} />;
}
