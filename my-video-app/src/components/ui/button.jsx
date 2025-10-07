import React from 'react';

export function Button({ children, variant, className, ...props }) {
  const baseClass = "px-4 py-2 rounded font-semibold";
  const variantClass = variant === 'link' ? 'text-blue-600 underline' : 'bg-blue-600 text-white';

  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
