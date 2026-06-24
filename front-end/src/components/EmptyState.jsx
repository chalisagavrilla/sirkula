import React from 'react';

export default function EmptyState({ children }) {
  return (
    <div className="surface-card px-4 py-6 text-center text-xs font-semibold text-slate-400">
      {children}
    </div>
  );
}
