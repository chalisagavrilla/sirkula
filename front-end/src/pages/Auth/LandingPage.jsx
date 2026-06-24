import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Trash2, Wallet } from 'lucide-react';
import StatusBar from '../../components/StatusBar';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="screen flex flex-col bg-[#f5f7fb]">
      <div className="top-blue min-h-[430px] rounded-b-[36px]">
        <StatusBar dark />
        <div className="px-5 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-blue-100">Lingkungan digital</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Sirkula.id</h1>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white text-[#0f6fff] shadow-lg">
              <ShieldCheck size={22} />
            </div>
          </div>

          <p className="mt-4 max-w-[280px] text-[13px] font-semibold leading-relaxed text-blue-50">
            Urus bank sampah, iuran, kebun komunitas, dan laporan fasilitas dari satu aplikasi warga.
          </p>

          <div className="glass-card mt-7 p-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wide text-blue-100">Saldo sampah warga</span>
                <h2 className="mt-1 text-2xl font-black text-white">Tersimpan rapi</h2>
              </div>
              <button onClick={() => navigate('/login')} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ffb321] text-slate-950">
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-white">
              <div className="rounded-2xl bg-white/12 p-2.5">
                <p className="text-[8px] font-black uppercase text-blue-100">Sampah</p>
                <p className="mt-1 text-[11px] font-black">Setor</p>
              </div>
              <div className="rounded-2xl bg-white/12 p-2.5">
                <p className="text-[8px] font-black uppercase text-blue-100">Iuran</p>
                <p className="mt-1 text-[11px] font-black">Bayar</p>
              </div>
              <div className="rounded-2xl bg-white/12 p-2.5">
                <p className="text-[8px] font-black uppercase text-blue-100">Aduan</p>
                <p className="mt-1 text-[11px] font-black">Pantau</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-card mx-5 -mt-10 flex flex-col items-center p-5 text-center">
        <h3 className="mb-4 text-sm font-black tracking-tight text-slate-800">Layanan warga</h3>
        <div className="grid w-full grid-cols-3 gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#0f6fff]"><Trash2 size={17} /></div>
            <span className="mt-2 text-[9px] font-black leading-tight text-slate-700">Bank<br />Sampah</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-500"><Wallet size={17} /></div>
            <span className="mt-2 text-[9px] font-black leading-tight text-slate-700">Iuran<br />Digital</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-500"><Leaf size={17} /></div>
            <span className="mt-2 text-[9px] font-black leading-tight text-slate-700">Kebun<br />Warga</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end space-y-3 px-5 pb-8 pt-5">
        <button onClick={() => navigate('/login')} className="warning-btn">Masuk</button>
        <button onClick={() => navigate('/register')} className="ghost-btn">Daftar</button>
      </div>
    </div>
  );
}
