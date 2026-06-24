import React, { useEffect, useMemo, useState } from 'react';
import { Bell, ChevronRight, CircleHelp, LockKeyhole, LogOut, Recycle, Sprout, UserRound, WalletCards } from 'lucide-react';
import StatusBar from '../../components/StatusBar';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const MenuItem = ({ icon: Icon, label, danger = false, onClick }) => (
  <button onClick={onClick} className="flex w-full items-center gap-4 border-b border-slate-100 bg-white p-4 text-left last:border-b-0">
    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${danger ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-[#0f6fff]'}`}>
      <Icon size={18} />
    </span>
    <span className={`flex-1 text-sm font-black ${danger ? 'text-red-500' : 'text-slate-700'}`}>{label}</span>
    {!danger && <ChevronRight size={18} className="text-slate-300" />}
  </button>
);

const formatRtRw = (value) => {
  if (!value) return 'RT/RW belum diisi';
  if (value.toUpperCase().includes('RT')) return value;
  const [rt, rw] = value.split('/');
  return `RT ${rt || '-'} / RW ${rw || '-'}`;
};

export default function AkunWarga() {
  const { auth, logoutGlobal } = useAuth();
  const profile = auth.profile || {};
  const initials = auth.nama ? auth.nama.substring(0, 2).toUpperCase() : 'WG';
  const [saldoSampah, setSaldoSampah] = useState(0);

  useEffect(() => {
    let ignore = false;

    const loadStats = async () => {
      if (!auth.wargaId) return;
      const response = await dataService.getWargaDashboard(auth.wargaId);
      if (!ignore) {
        setSaldoSampah(Number(response.data.data?.saldo_sampah || 0));
      }
    };

    loadStats();
    return () => { ignore = true; };
  }, [auth.wargaId]);

  const saldoPoin = useMemo(() => Math.max(0, Math.round(saldoSampah / 50)), [saldoSampah]);
  const estimasiSetoran = useMemo(() => Math.max(1, Math.round(saldoSampah / 5000)), [saldoSampah]);

  return (
    <div className="screen">
      <div className="top-blue relative overflow-hidden rounded-b-[28px] pb-9 shadow-[0_18px_32px_rgba(12,78,180,0.18)]">
        <StatusBar dark />
        <div className="relative px-5 pt-3 text-center text-white">
          <h1 className="text-xl font-black">Profil Saya</h1>
          <div className="mx-auto mt-5 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/35 bg-white text-3xl font-black text-[#1769e8] shadow-[0_12px_24px_rgba(0,0,0,0.16)]">
            {initials}
          </div>
          <h2 className="mx-auto mt-4 max-w-[300px] break-words text-xl font-black leading-snug">{auth.nama || 'Warga Sirkula'}</h2>
          <p className="mt-1 text-sm font-medium text-blue-100">{profile.no_hp || '-'}</p>
          <span className="mt-3 inline-flex max-w-full rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-[10px] font-black uppercase leading-tight">
            {formatRtRw(profile.rt_rw)}
          </span>
        </div>
      </div>

      <div className="space-y-6 px-5 pb-24 pt-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[18px] bg-white p-4 text-center shadow-[0_12px_24px_rgba(28,47,84,0.08)]">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-500"><WalletCards size={18} /></div>
            <p className="mt-2 text-[10px] font-black text-slate-400">Poin</p>
            <p className="text-sm font-black text-slate-900">{saldoPoin.toLocaleString('id-ID')}</p>
          </div>
          <div className="rounded-[18px] bg-white p-4 text-center shadow-[0_12px_24px_rgba(28,47,84,0.08)]">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#0f6fff]"><Recycle size={18} /></div>
            <p className="mt-2 text-[10px] font-black text-slate-400">Setoran</p>
            <p className="text-sm font-black text-slate-900">{estimasiSetoran}x</p>
          </div>
          <div className="rounded-[18px] bg-white p-4 text-center shadow-[0_12px_24px_rgba(28,47,84,0.08)]">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600"><Sprout size={18} /></div>
            <p className="mt-2 text-[10px] font-black text-slate-400">Kebun</p>
            <p className="text-sm font-black text-slate-900">4x</p>
          </div>
        </div>

        <section>
          <h3 className="mb-3 px-2 text-xs font-black uppercase tracking-wider text-slate-400">Akun</h3>
          <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_12px_24px_rgba(28,47,84,0.08)]">
            <MenuItem icon={UserRound} label="Data Diri" />
            <MenuItem icon={LockKeyhole} label="Keamanan & Sandi" />
            <MenuItem icon={Bell} label="Pengaturan Notifikasi" />
          </div>
        </section>

        <section>
          <h3 className="mb-3 px-2 text-xs font-black uppercase tracking-wider text-slate-400">Lainnya</h3>
          <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_12px_24px_rgba(28,47,84,0.08)]">
            <MenuItem icon={CircleHelp} label="Bantuan & FAQ" />
            <MenuItem icon={LogOut} label="Keluar" danger onClick={logoutGlobal} />
          </div>
        </section>

        <p className="text-center text-[11px] font-semibold text-slate-400">Sirkula.id v1.0.0</p>
      </div>
    </div>
  );
}
