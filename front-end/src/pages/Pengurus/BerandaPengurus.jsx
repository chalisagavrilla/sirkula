import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Bell, CreditCard, Leaf, Recycle, ShieldCheck, Users, Wallet } from 'lucide-react';
import StatusBar from '../../components/StatusBar';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const rupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

export default function BerandaPengurus() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const initials = auth.nama ? auth.nama.substring(0, 2).toUpperCase() : 'AD';
  const firstName = (auth.nama || 'Admin').split(' ')[0];
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      setLoading(true);
      const response = await dataService.getPengurusDashboard();
      if (!ignore) {
        setStats(response.data.data || {});
        setLoading(false);
      }
    };

    loadDashboard();
    return () => { ignore = true; };
  }, []);

  const totalKas = stats?.total_kas_rt || 0;
  const totalSampah = Number(stats?.total_berat_sampah || 0);
  const aduanPending = Number(stats?.aduan_warga_pending || 0);

  return (
    <div className="screen">
      <StatusBar />

      <div className="rounded-b-[24px] bg-white px-5 pb-5 pt-4 shadow-[0_12px_28px_rgba(28,47,84,0.08)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82ff] to-[#075ee8] text-sm font-black uppercase text-white shadow-[0_12px_22px_rgba(15,111,255,0.24)]">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight text-[#1847a8]">Halo, {firstName}</h2>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">{auth.profile?.jabatan || 'Pengurus RT/RW'}</p>
            </div>
          </div>
          <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-500">
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
          </button>
        </div>
      </div>

      <div className="space-y-5 px-5 pb-24 pt-5">
        <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#ffd33f] via-[#ffc226] to-[#ffad19] p-5 text-slate-950 shadow-[0_18px_34px_rgba(255,183,27,0.28)]">
          <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/20" />
          <div className="absolute -bottom-12 right-6 h-28 w-28 rounded-full bg-white/20" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-800">Total Kas Lingkungan</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight">{loading ? 'Memuat...' : rupiah(totalKas)}</h1>
              <p className="mt-1 text-sm font-black">{totalSampah.toLocaleString('id-ID')} Kg sampah</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/30 text-white">
              <CreditCard size={24} />
            </div>
          </div>
          <div className="relative mt-5 flex items-center justify-between rounded-full bg-white/35 px-4 py-2 text-[10px] font-black">
            <span>ADMIN PANEL</span>
            <span>{(auth.nama || 'SIRKULA ADMIN').toUpperCase()}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            ['Sampah', Recycle, 'bg-blue-50 text-[#0f6fff]', '/pengurus/sampah'],
            ['Iuran', Wallet, 'bg-emerald-50 text-emerald-600', '/pengurus/iuran'],
            ['Laporan', AlertTriangle, 'bg-orange-50 text-orange-500', '/pengurus/lapor'],
            ['Kebun', Leaf, 'bg-green-50 text-green-600', '/pengurus/kebun'],
          ].map(([label, Icon, color, path]) => (
            <button key={label} onClick={() => navigate(path)} className="flex flex-col items-center gap-2">
              <div className={`flex h-14 w-14 items-center justify-center rounded-[18px] shadow-[0_8px_18px_rgba(28,47,84,0.08)] ${color}`}>
                <Icon size={21} />
              </div>
              <span className="text-[10px] font-black leading-tight text-slate-700">{label}</span>
            </button>
          ))}
        </div>

        <button onClick={() => navigate('/pengurus/iuran')} className="flex w-full items-center justify-between gap-3 rounded-[20px] bg-white p-4 text-left shadow-[0_12px_28px_rgba(28,47,84,0.08)]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0f6fff]">
            <ShieldCheck size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-black text-slate-800">Rekap Iuran Warga</h4>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Kas masuk dan status pembayaran</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-[#0f6fff]">{rupiah(totalKas)}</p>
            <span className="mt-1 inline-flex rounded-md bg-green-50 px-2 py-1 text-[8px] font-black uppercase text-green-600">Aktif</span>
          </div>
        </button>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black uppercase tracking-wide text-[#1847a8]">Aktivitas Terakhir</h3>
            <button className="text-[11px] font-black text-[#0f6fff]">Lihat Semua</button>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[20px] bg-white p-4 shadow-[0_12px_28px_rgba(28,47,84,0.08)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <AlertTriangle size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-black text-slate-800">Aduan warga pending</h4>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Perlu ditangani pengurus</p>
            </div>
            <p className="text-base font-black text-[#0f6fff]">{aduanPending}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
