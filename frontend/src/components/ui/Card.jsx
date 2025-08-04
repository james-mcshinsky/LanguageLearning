import React from 'react';
import Button from './Button';

function Card({ className = '', children, ...props }) {
  const base =
    'bg-white border border-[#E5F9CE] rounded-[0.75rem] p-[1.5rem] text-[#5D5D5D] [&_h1]:font-semibold [&_h1]:text-[#072F45] [&_h2]:font-semibold [&_h2]:text-[#072F45] [&_h3]:font-semibold [&_h3]:text-[#072F45]';
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
