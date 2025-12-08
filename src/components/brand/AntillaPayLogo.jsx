import React from 'react';
import logo from '@/assets/cards/logo.png';

export default function AntillaCapitalLogo({ className = "", size = "default", showText = true }) {
  const sizes = {
    small: { icon: 28, text: "text-lg" },
    default: { icon: 36, text: "text-xl" },
    large: { icon: 48, text: "text-2xl" }
  };

  const { icon, text } = sizes[size] || sizes.default;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={logo} alt="AntillaPay Logo" style={{ width: icon, height: icon }} />
      {showText && (
        <span 
          className={`font-bold ${text} text-gray-900`}
          style={{ 
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          AntillaPay
        </span>
      )}
    </div>
  );
}
