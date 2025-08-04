import React from 'react';
import Button from './Button';

function Card({ className = '', children, ...props }) {
  const base =
    'bg-white border border-primary-light rounded-[0.75rem] p-[1.5rem] text-text-secondary [&_h1]:font-semibold [&_h1]:text-[var(--color-accent-dark)] [&_h2]:font-semibold [&_h2]:text-[var(--color-accent-dark)] [&_h3]:font-semibold [&_h3]:text-[var(--color-accent-dark)]';
  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
}

Card.Button = function CardButton({ className = '', ...props }) {
  return <Button variant="secondary" className={className} {...props} />;
};

export default Card;
