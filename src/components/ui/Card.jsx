import React from 'react';

// Card component with border and shadow styling
export const Card = ({ children, className }) => {
  return (
    <div className={`border rounded-lg shadow-md bg-white ${className}`}>
      {children}
    </div>
  );
};

// CardContent component with padding and flexible content display
export const CardContent = ({ children, className }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

export default CardContent;