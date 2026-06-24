import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Eye, EyeOff, FileText, Loader2, Lock, Mail, MapPin, Phone, ShieldCheck, User, Users } from 'lucide-react';
import StatusBar from '../../components/StatusBar';
import { authService } from '../../services/authService';

const roles = [
  { id: 'warga', label: 'Warga', sub: 'Akses layanan harian', icon: User },
  { id: 'pengurus', label: 'Pengurus', sub: 'Kelola operasional RT', icon: Users },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('warga');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    nama_lengkap: '',
    email: '',
    no_kk: '',
    no_hp: '',
    alamat: '',
    rt: '',
    rw: '',
    jabatan: '',
    password: '',
  });

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    const rtRw = role === 'warga'
      ? `${form.rt.trim().padStart(2, '0')}/${form.rw.trim().padStart(2, '0')}`
      : '';

    const response = await authService.register({
      role,
      email: form.email,
      password: form.password,
      nama_lengkap: form.nama_lengkap,
      no_hp: form.no_hp,
      alamat: form.alamat,
      rt_rw: rtRw,
      jabatan: form.jabatan || 'Pengurus RT/RW',
    });

    setLoading(false);
    if (response.status >= 200 && response.status < 300) {
      alert('Pendaftaran berhasil. Silakan login.');
      navigate('/login');
      return;
    }

    setMessage(response.data.message || 'Pendaftaran gagal. Coba lagi.');
  };

  return (
    <div className="screen bg-[#f5f7fb]">
      <div className="top-blue rounded-b-[34px] pb-8">
        <StatusBar dark />
        <div className="px-5 pt-2">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white">
              <ArrowLeft size={19} />
            </button>
            <span className="rounded-full bg-white/15 px-3 py-1 text-[9px] font-black uppercase tracking-wide text-blue-100">Sirkula.id</span>
          </div>

          <div className="mt-7">
            <p className="text-[10px] font-black uppercase tracking-wider text-blue-100">Mulai akun baru</p>
            <h1 className="mt-1 text-3xl font-black leading-tight text-white">Daftar layanan lingkungan</h1>
            <p className="mt-2 max-w-[260px] text-[12px] font-semibold leading-relaxed text-blue-100">
              Pilih peran, isi data singkat, lalu akun langsung tersambung ke database Sirkula.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {roles.map(({ id, label, sub, icon: Icon }) => {
              const active = role === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  className={`rounded-[22px] border p-3 text-left transition active:scale-[0.98] ${active ? 'border-white bg-white text-[#0f6fff] shadow-xl' : 'border-white/15 bg-white/10 text-white'}`}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${active ? 'bg-blue-50' : 'bg-white/15'}`}>
                    <Icon size={17} />
                  </div>
                  <p className="mt-3 text-xs font-black">{label}</p>
                  <p className={`mt-0.5 text-[9px] font-bold leading-tight ${active ? 'text-slate-400' : 'text-blue-100'}`}>{sub}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="-mt-4 space-y-3 px-5 pb-8">
        <div className="surface-card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">Data akun</p>
              <h2 className="text-base font-black text-slate-800">{role === 'pengurus' ? 'Profil pengurus' : 'Profil warga'}</h2>
            </div>
            <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-[9px] font-black uppercase ${role === 'pengurus' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
              {role === 'pengurus' ? <BadgeCheck size={11} /> : <ShieldCheck size={11} />}
              {role}
            </span>
          </div>

          <div className="field-shell">
            <User size={16} className="text-slate-400" />
            <input value={form.nama_lengkap} onChange={(event) => updateField('nama_lengkap', event.target.value)} type="text" placeholder="Nama lengkap" className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400" required />
          </div>

          <div className="field-shell">
            <Mail size={16} className="text-slate-400" />
            <input value={form.email} onChange={(event) => updateField('email', event.target.value)} type="email" placeholder="nama@email.com" className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400" required />
          </div>

          <div className="field-shell">
            <Phone size={16} className="text-slate-400" />
            <input value={form.no_hp} onChange={(event) => updateField('no_hp', event.target.value)} type="tel" placeholder="Nomor telepon" className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400" required />
          </div>

          {role === 'pengurus' ? (
            <div className="field-shell">
              <BadgeCheck size={16} className="text-slate-400" />
              <input value={form.jabatan} onChange={(event) => updateField('jabatan', event.target.value)} type="text" placeholder="Jabatan, contoh: Bendahara RT" className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="field-shell">
                  <FileText size={16} className="text-slate-400" />
                  <input value={form.no_kk} onChange={(event) => updateField('no_kk', event.target.value)} type="text" placeholder="Nomor KK" className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400" />
                </div>
                <div className="field-shell">
                  <MapPin size={16} className="text-slate-400" />
                  <input value={form.rt} onChange={(event) => updateField('rt', event.target.value.replace(/\D/g, '').slice(0, 3))} type="text" inputMode="numeric" placeholder="RT" className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400" required />
                </div>
              </div>

              <div className="field-shell">
                <MapPin size={16} className="text-slate-400" />
                <input value={form.rw} onChange={(event) => updateField('rw', event.target.value.replace(/\D/g, '').slice(0, 3))} type="text" inputMode="numeric" placeholder="RW" className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400" required />
              </div>

              <div className="field-shell">
                <MapPin size={16} className="text-slate-400" />
                <input value={form.alamat} onChange={(event) => updateField('alamat', event.target.value)} type="text" placeholder="Alamat rumah" className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400" required />
              </div>
            </>
          )}

          <div className="field-shell justify-between">
            <div className="flex flex-1 items-center gap-2">
              <Lock size={16} className="text-slate-400" />
              <input value={form.password} onChange={(event) => updateField('password', event.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Kata sandi" className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400" required />
            </div>
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {message && <p className="rounded-2xl bg-red-50 px-3 py-2 text-[10px] font-bold text-red-500">{message}</p>}

          <button type="submit" disabled={loading} className="primary-btn flex items-center justify-center gap-2 disabled:opacity-60">
            {loading && <Loader2 size={15} className="animate-spin" />}
            Daftar Sekarang
          </button>
        </div>

        <p className="text-center text-[11px] font-semibold text-slate-400">
          Sudah punya akun? <span className="cursor-pointer font-black text-[#1769e8]" onClick={() => navigate('/login')}>Masuk</span>
        </p>
      </form>
    </div>
  );
}
