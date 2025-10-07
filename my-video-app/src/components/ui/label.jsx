import React from 'react';

export function Label({ children, className, ...props }) {
  return (
    <label className={`block font-medium mb-1 ${className}`} {...props}>
      {children}
    </label>
  );
}
