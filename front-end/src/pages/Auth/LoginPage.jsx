import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, Loader2, Recycle, ShieldCheck, WalletCards } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatusBar from '../../components/StatusBar';
import { authService } from '../../services/authService';

export default function LoginPage() {
  const { loginGlobal } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loadingRole, setLoadingRole] = useState(null);
  const [error, setError] = useState('');

  const submitLogin = async (email, password, roleIntent = 'warga') => {
    setError('');
    setLoadingRole(roleIntent);
    const response = await authService.login(email, password);

    if (response.status >= 200 && response.status < 300 && response.data.user) {
      loginGlobal(response.data.user);
      const nextRoute = response.data.user.role === 'pengurus' ? '/pengurus/dashboard' : '/warga/dashboard';
      navigate(nextRoute, { replace: true });
    } else {
      setError(response.data.message || 'Login gagal. Periksa email dan kata sandi.');
    }

    setLoadingRole(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitLogin(form.email, form.password, 'warga');
  };

  return (
    <div className="screen bg-[#f7fbff]">
      <div className="relative overflow-hidden rounded-b-[38px] bg-gradient-to-br from-[#2f73ff] via-[#0964e8] to-[#0046b8] pb-9 text-white">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-[#ffcf37]/20" />
        <StatusBar dark />
        <div className="relative px-5 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-blue-100">Sirkula.id</p>
              <h1 className="mt-1 text-3xl font-black leading-tight">Masuk ke layanan warga</h1>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white text-[#0f6fff] shadow-xl">
              <ShieldCheck size={22} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              ['Setor', Recycle, 'bg-blue-400/20'],
              ['Bayar', WalletCards, 'bg-yellow-300/20'],
              ['Kebun', Leaf, 'bg-green-300/20'],
            ].map(([label, Icon, color]) => (
              <div key={label} className={`rounded-[18px] border border-white/10 ${color} p-3`}>
                <Icon size={18} />
                <p className="mt-2 text-[10px] font-black">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="-mt-5 px-5 pb-8">
        <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_36px_rgba(28,47,84,0.12)]">
          <div className="mb-5">
            <h2 className="text-2xl font-black leading-tight text-slate-900">Selamat datang kembali</h2>
            <p className="mt-1 text-[12px] font-semibold text-slate-400">Gunakan akun warga atau pengurus yang sudah terdaftar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="nama@email.com"
                className="field"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500">Kata sandi</label>
              <div className="field-shell">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Masukkan kata sandi"
                  className="w-full bg-transparent text-xs font-semibold text-slate-700 outline-none"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="rounded-2xl bg-red-50 px-3 py-2 text-[10px] font-bold text-red-500">{error}</p>}

            <button type="submit" disabled={loadingRole !== null} className="primary-btn flex items-center justify-center gap-2 disabled:opacity-70">
              {loadingRole === 'warga' && <Loader2 size={15} className="animate-spin" />}
              Masuk
            </button>
          </form>

          <div className="my-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">akses pengurus</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <p className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-center text-[11px] font-bold leading-relaxed text-[#0f6fff]">
            Pengurus masuk memakai email dan kata sandi yang sudah terdaftar.
          </p>
        </div>

        <p className="pt-5 text-center text-[11px] font-semibold text-slate-400">
          Belum punya akun? <span className="cursor-pointer font-black text-[#1769e8]" onClick={() => navigate('/register')}>Daftar</span>
        </p>
      </div>
    </div>
  );
}
