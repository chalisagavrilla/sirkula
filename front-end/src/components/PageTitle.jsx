import React from 'react';

export default function PageTitle({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#1769e8]">
            <Icon size={16} />
          </span>
        )}
        <h2 className="text-lg font-black tracking-tight text-[#1769e8]">{title}</h2>
      </div>
      {subtitle && <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-400">{subtitle}</p>}
    </div>
  );
}
