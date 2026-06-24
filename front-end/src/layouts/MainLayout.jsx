import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CreditCard, Home, Sprout, Trash2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const wargaTabs = [
  { path: '/warga/dashboard', label: 'Beranda', icon: Home },
  { path: '/warga/sampah', label: 'Sampah', icon: Trash2 },
  { path: '/warga/iuran', label: 'Iuran', icon: CreditCard },
  { path: '/warga/kebun', label: 'Kebun', icon: Sprout },
  { path: '/warga/lapor', label: 'Lapor', icon: AlertCircle },
  { path: '/warga/akun', label: 'Akun', icon: User },
];

const pengurusTabs = [
  { path: '/pengurus/dashboard', label: 'Beranda', icon: Home },
  { path: '/pengurus/sampah', label: 'Sampah', icon: Trash2 },
  { path: '/pengurus/iuran', label: 'Iuran', icon: CreditCard },
  { path: '/pengurus/kebun', label: 'Kebun', icon: Sprout },
  { path: '/pengurus/lapor', label: 'Lapor', icon: AlertCircle },
  { path: '/pengurus/akun', label: 'Akun', icon: User },
];

export default function MainLayout() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const tabs = auth.role === 'pengurus' ? pengurusTabs : wargaTabs;

  return (
    <div className="relative flex h-full w-full flex-col bg-[#f5f7fb]">
      <main className="flex-1 overflow-y-auto pb-[78px]">
        <Outlet />
      </main>

      <nav className="absolute bottom-0 left-0 z-50 mx-3 mb-3 flex h-[64px] w-[calc(100%-24px)] items-center justify-between rounded-[24px] border border-white bg-white px-1.5 shadow-[0_-8px_24px_rgba(20,45,85,0.10)]">
        {tabs.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              className={`flex h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-[18px] text-[8px] font-black transition ${active ? 'bg-blue-50 text-[#0f6fff]' : 'text-slate-300'}`}
            >
              <Icon size={17} strokeWidth={active ? 3 : 2.5} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
