import React from 'react';

export const Badge = ({ children, className }) => {
  return (
    <span className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${className}`}>
      {children}
    </span>
  );
};
