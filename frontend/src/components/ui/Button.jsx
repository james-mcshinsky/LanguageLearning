import React from 'react';

const base = 'focus:outline focus:outline-2 focus:outline-offset-2';
const variants = {
  primary: 'button-primary',
  secondary: 'button-secondary',
  outline: 'border',
};

export default function Button({ variant = 'primary', className = '', ...props }) {
  const styles = `${base} ${variants[variant] || ''} ${className}`;
  return <button className={styles} {...props} />;
}
