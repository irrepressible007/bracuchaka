// client/src/components/Logo.jsx

import React from 'react';

/**
 * A simple SVG logo for "BC".
 * It inherits its color from the 'text-...' Tailwind class.
 * @param {string} className - Tailwind classes for size and color.
 */
const Logo = ({ className = 'w-8 h-8' }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    fill="currentColor" // Inherits color (e.g., text-blue-600 or text-white)
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="100" height="100" rx="20" />
    <text 
      x="50%" 
      y="54%" 
      dominantBaseline="middle" 
      textAnchor="middle"
      fontSize="55" 
      fontWeight="bold" 
      fill="#FFF" // White letters
    >
      BC
    </text>
  </svg>
);

export default Logo;