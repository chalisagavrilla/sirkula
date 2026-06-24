import React from 'react';

export default function CardItem({ children, title, badgeText, badgeVariant = 'amber' }) {
  const badges = {
    amber: "bg-amber-100 text-amber-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-500",
    blue: "bg-blue-100 text-[#1658E4]"
  };

  return (
    <div className="border border-gray-100 p-4 rounded-2xl bg-white flex justify-between items-center shadow-sm w-full">
      <div className="flex-1">
        {title && <h4 className="text-sm font-bold text-gray-800 leading-tight">{title}</h4>}
        <div className="mt-1 text-xs text-gray-500">
          {children}
        </div>
      </div>
      {badgeText && (
        <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-md ml-3 ${badges[badgeVariant]}`}>
          {badgeText}
        </span>
      )}
    </div>
  );
}