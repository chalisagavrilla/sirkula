import React from 'react';

export default function ButtonCapsule({ children, onClick, type = 'button', variant = 'blue', disabled = false }) {
  const baseStyle = "w-full h-12 font-bold rounded-full shadow-md active:scale-[0.98] transition flex items-center justify-center text-sm tracking-wide";
  
  const variants = {
    blue: "bg-[#1658E4] text-white hover:bg-blue-700",
    yellow: "bg-[#FFB800] text-gray-900 hover:bg-amber-500",
    outline: "bg-white border border-[#1658E4] text-[#1658E4] hover:bg-gray-50"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}