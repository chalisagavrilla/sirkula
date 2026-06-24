import React from 'react';

export default function InputGroup({ label, type = 'text', placeholder, value, onChange, required = false }) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-gray-700 mb-1.5 tracking-wider uppercase">{label}</label>}
      <div className="border border-gray-200 rounded-xl bg-gray-50 px-4 h-11 flex items-center shadow-inner focus-within:border-[#1658E4] transition">
        <input 
          type={type} 
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    </div>
  );
}