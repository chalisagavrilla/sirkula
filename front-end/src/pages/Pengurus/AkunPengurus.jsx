import React from 'react';
import { ChevronRight, LogOut, Settings, ShieldCheck, UserCog, UsersRound } from 'lucide-react';
import StatusBar from '../../components/StatusBar';
import { useAuth } from '../../context/AuthContext';

const MenuItem = ({ icon: Icon, label, danger = false, onClick }) => (
  <button onClick={onClick} className="flex w-full items-center gap-4 border-b border-slate-100 bg-white p-4 text-left last:border-b-0">
    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${danger ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-[#0f6fff]'}`}>
      <Icon size={18} />
    </span>
    <span className={`flex-1 text-sm font-black ${danger ? 'text-red-500' : 'text-slate-700'}`}>{label}</span>
    {!danger && <ChevronRight size={18} className="text-slate-300" />}
  </button>
);

export default function AkunPengurus() {
  const { auth, logoutGlobal } = useAuth();
  const profile = auth.profile || {};
  const initials = auth.nama ? auth.nama.substring(0, 2).toUpperCase() : 'AD';

  return (
    <div className="screen">
      <div className="top-blue relative overflow-hidden rounded-b-[32px] pb-10">
        <div className="absolute -right-8 -top-12 h-28 w-28 rounded-full bg-white/10" />
        <StatusBar dark />
        <div className="relative px-5 pt-3 text-center text-white">
          <h1 className="text-xl font-black">Akun Pengurus</h1>
          <div className="mx-auto mt-5 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/25 bg-white text-3xl font-black text-[#1769e8] shadow-[0_12px_24px_rgba(0,0,0,0.16)]">
            {initials}
          </div>
          <h2 className="mt-4 text-xl font-black">{auth.nama || 'Admin Sirkula'}</h2>
          <p className="mt-1 text-sm font-medium text-blue-100">{profile.no_hp || '-'}</p>
          <span className="mt-3 inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-[10px] font-black uppercase">
            {profile.jabatan || 'Pengurus RT/RW'}
          </span>
        </div>
      </div>

      <div className="space-y-6 px-5 pb-24 pt-4">
        <section>
          <h3 className="mb-3 px-2 text-xs font-black uppercase tracking-wider text-slate-400">Kelola Wilayah</h3>
          <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_12px_24px_rgba(28,47,84,0.08)]">
            <MenuItem icon={UsersRound} label="Daftar Warga" />
            <MenuItem icon={Settings} label="Pengaturan RW / RT" />
          </div>
        </section>

        <section>
          <h3 className="mb-3 px-2 text-xs font-black uppercase tracking-wider text-slate-400">Akun Saya</h3>
          <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_12px_24px_rgba(28,47,84,0.08)]">
            <MenuItem icon={UserCog} label="Profil Saya" />
            <MenuItem icon={ShieldCheck} label="Keamanan" />
            <MenuItem icon={LogOut} label="Keluar" danger onClick={logoutGlobal} />
          </div>
        </section>

        <p className="text-center text-[11px] font-semibold text-slate-400">Sirkula.id Pengurus v1.0.0</p>
      </div>
    </div>
  );
}
