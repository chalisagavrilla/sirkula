import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Coins, CreditCard, Loader2, ReceiptText, ShieldCheck, Smartphone, WalletCards } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import StatusBar from '../../components/StatusBar';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import { dataService } from '../../services/dataService';

const rupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

const methods = [
  { id: 'transfer', label: 'Transfer Bank', note: 'BCA - BRI - Mandiri', icon: CreditCard, tone: 'blue' },
  { id: 'ewallet', label: 'e-Wallet', note: 'GoPay - OVO - DANA', icon: Smartphone, tone: 'green' },
  { id: 'poin', label: 'Potong Poin', note: 'Gunakan saldo poin warga', icon: Coins, tone: 'amber' },
];

export default function IuranWarga() {
  const { auth } = useAuth();
  const [tagihan, setTagihan] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('transfer');
  const [payingId, setPayingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saldoPoin, setSaldoPoin] = useState(0);

  const fetchTagihan = async () => {
    if (!auth.wargaId) return;
    setLoading(true);
    const [tagihanResponse, dashboardResponse] = await Promise.all([
      apiRequest(`warga/iuranwarga.php?id_warga=${auth.wargaId}`),
      dataService.getWargaDashboard(auth.wargaId),
    ]);
    setTagihan(tagihanResponse.data.data || []);
    const saldoSampah = Number(dashboardResponse.data.data?.saldo_sampah || 0);
    setSaldoPoin(Math.max(0, Math.round(saldoSampah / 50)));
    setLoading(false);
  };

  useEffect(() => {
    fetchTagihan();
  }, [auth.wargaId]);

  const unpaid = useMemo(() => tagihan.filter((item) => item.status_bayar === 'belum_bayar'), [tagihan]);
  const paid = useMemo(() => tagihan.filter((item) => item.status_bayar === 'lunas'), [tagihan]);
  const totalUnpaid = unpaid.reduce((sum, item) => sum + Number(item.jumlah_tagihan || 0), 0);
  const nextBill = unpaid[0];
  const selectedMethodInfo = methods.find((method) => method.id === selectedMethod);
  const poinDibutuhkan = Math.ceil(Number(nextBill?.jumlah_tagihan || 0) / 40);
  const poinCukup = selectedMethod !== 'poin' || saldoPoin >= poinDibutuhkan;

  const handlePay = async (id_iuran) => {
    setMessage('');

    const bill = tagihan.find((item) => item.id_iuran === id_iuran);
    const neededPoints = Math.ceil(Number(bill?.jumlah_tagihan || 0) / 40);
    if (selectedMethod === 'poin' && saldoPoin < neededPoints) {
      setMessage(`Poin belum cukup. Butuh ${neededPoints.toLocaleString('id-ID')} poin, saldo kamu ${saldoPoin.toLocaleString('id-ID')} poin.`);
      return;
    }

    setPayingId(id_iuran);

    const response = await apiRequest('warga/iuranwarga.php', 'POST', {
      id_iuran,
      metode_pembayaran: selectedMethod,
    });

    if (response.status >= 200 && response.status < 300) {
      setMessage(`Pembayaran ${selectedMethodInfo.label} berhasil tersimpan ke database.`);
      await fetchTagihan();
    } else {
      setMessage(response.data.message || 'Pembayaran gagal diproses.');
    }

    setPayingId(null);
  };

  return (
    <div className="screen">
      <div className="top-blue rounded-b-[42px] pb-24">
        <StatusBar dark />
        <div className="px-5 pt-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-blue-100">Pembayaran</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight">Iuran Warga</h2>
              <p className="mt-1 text-[11px] font-semibold leading-relaxed text-blue-100">Bayar tagihan kas dan kebersihan lingkungan.</p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white/15 text-white">
              <WalletCards size={22} />
            </span>
          </div>
        </div>
      </div>

      <div className="-mt-20 space-y-5 px-5 pb-24">
        <div className="rounded-[28px] bg-white p-6 text-center shadow-[0_18px_36px_rgba(28,47,84,0.14)]">
          <p className="text-[11px] font-black text-slate-400">Tagihan Bulan Ini</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">{loading ? 'Memuat...' : rupiah(nextBill?.jumlah_tagihan || totalUnpaid)}</h1>

          <div className="mt-6 rounded-[22px] border border-slate-100 bg-slate-50 p-4 text-left">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-slate-900">Iuran {nextBill?.bulan_tahun || 'Terkini'}</h4>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <CalendarDays size={14} />
                  <span>Jatuh tempo tanggal 10</span>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500">Status</p>
                <div className={`mt-1 flex h-7 w-12 items-center rounded-full p-1 ${nextBill ? 'justify-start bg-red-100' : 'justify-end bg-green-100'}`}>
                  <span className={`h-5 w-5 rounded-full ${nextBill ? 'bg-red-500' : 'bg-green-500'}`} />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => nextBill && handlePay(nextBill.id_iuran)}
            disabled={!nextBill || payingId !== null || !poinCukup}
            className="warning-btn mt-6 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {payingId === nextBill?.id_iuran ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            Bayar Sekarang
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <ReceiptText size={17} className="text-[#0f6fff]" />
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">Metode Pembayaran</h3>
          </div>

          <div className="space-y-3">
            {methods.map(({ id, label, note, icon: Icon }) => {
              const active = selectedMethod === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedMethod(id)}
                  className={`flex w-full items-center gap-4 rounded-[20px] border bg-white p-4 text-left shadow-[0_10px_24px_rgba(28,47,84,0.07)] transition active:scale-[0.98] ${active ? 'border-[#0f6fff]' : 'border-white'}`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${id === 'transfer' ? 'bg-blue-50 text-[#0f6fff]' : id === 'ewallet' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'}`}>
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-slate-800">{label}</span>
                    <span className="mt-0.5 block text-[11px] font-semibold text-slate-500">
                      {id === 'poin' ? `Tersedia ${saldoPoin.toLocaleString('id-ID')} poin` : note}
                    </span>
                  </span>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${active ? 'border-[#0f6fff]' : 'border-slate-300'}`}>
                    {active && <span className="h-2.5 w-2.5 rounded-full bg-[#0f6fff]" />}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => nextBill && handlePay(nextBill.id_iuran)}
            disabled={!nextBill || payingId !== null || !poinCukup}
            className="primary-btn mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {payingId === nextBill?.id_iuran ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            Bayar Sekarang
          </button>

          {selectedMethod === 'poin' && nextBill && (
            <p className={`rounded-2xl px-3 py-2 text-[10px] font-bold ${poinCukup ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              Butuh {poinDibutuhkan.toLocaleString('id-ID')} poin untuk membayar tagihan ini.
            </p>
          )}

          {message && (
            <p className={`rounded-2xl px-3 py-2 text-[10px] font-bold ${message.includes('berhasil') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <h4 className="pl-1 text-sm font-black uppercase tracking-wide text-[#075bbd]">Riwayat</h4>
          {loading ? (
            <div className="surface-card flex items-center justify-center gap-2 p-4 text-xs font-black text-slate-400">
              <Loader2 size={15} className="animate-spin" /> Memuat iuran
            </div>
          ) : tagihan.length === 0 ? (
            <EmptyState>Belum ada tagihan iuran.</EmptyState>
          ) : (
            tagihan.map((item) => {
              const paidStatus = item.status_bayar === 'lunas';
              return (
                <div key={item.id_iuran} className="flex items-center justify-between gap-3 rounded-[20px] bg-white p-4 shadow-[0_10px_24px_rgba(28,47,84,0.07)]">
                  <div className="min-w-0">
                    <h5 className="truncate text-xs font-black text-slate-800">Iuran periode {item.bulan_tahun}</h5>
                    <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                      {rupiah(item.jumlah_tagihan)} {item.metode_pembayaran ? `via ${item.metode_pembayaran.toUpperCase()}` : ''}
                    </p>
                    {item.tanggal_bayar && <p className="mt-0.5 text-[9px] font-bold text-slate-400">{item.tanggal_bayar}</p>}
                  </div>
                  {paidStatus ? (
                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[8px] font-black uppercase text-green-600">
                      <ShieldCheck size={10} /> Lunas
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePay(item.id_iuran)}
                      disabled={payingId !== null}
                      className="rounded-full bg-red-50 px-3 py-1.5 text-[8px] font-black uppercase text-red-500 disabled:opacity-60"
                    >
                      Bayar
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
