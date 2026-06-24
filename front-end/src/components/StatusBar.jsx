import React from 'react';
import { Battery, Signal, Wifi } from 'lucide-react';

export default function StatusBar({ dark = false, time = '12.10' }) {
  const color = dark ? 'text-white' : 'text-[#0f2344]';

  return (
    <div className={`status-bar ${color}`}>
      <span>{time}</span>
      <div className="flex items-center gap-1">
        <Signal size={10} strokeWidth={3} />
        <Wifi size={10} strokeWidth={3} />
        <Battery size={12} strokeWidth={2.6} />
      </div>
    </div>
  );
}
