import React, { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import PageTitle from '../../components/PageTitle';
import StatusBar from '../../components/StatusBar';
import { apiRequest } from '../../services/api';

export default function IuranPengurus() {
  const [rekap, setRekap] = useState([]);
  const [newTagihan, setNewTagihan] = useState({ bulan_tahun: '2026-07', jumlah_tagihan: '50000' });

  const fetchRekapIuran = async () => {
    const result = await apiRequest('pengurus/iuranpengurus.php', 'GET', null, { 'X-User-Role': 'pengurus' });
    setRekap(result.data.data || []);
  };

  useEffect(() => { fetchRekapIuran(); }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const res = await apiRequest('pengurus/iuranpengurus.php', 'POST', newTagihan, { 'X-User-Role': 'pengurus' });
    if (res.status >= 200 && res.status < 300) {
      fetchRekapIuran();
      alert('Tagihan massal bulanan sukses dibuat!');
    }
  };

  return (
    <div className="screen">
      <StatusBar />
      <div className="px-5 pb-20 pt-3">
        <PageTitle icon={CreditCard} title="Kelola Kas Iuran" subtitle="Terbitkan tagihan baru dan pantau pembukuan warga." />

        <form onSubmit={handleGenerate} className="surface-card mb-5 space-y-3 p-4">
          <h4 className="text-xs font-black text-slate-700">Terbitkan Tagihan Massal Baru</h4>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="YYYY-MM" className="field" value={newTagihan.bulan_tahun} onChange={(e) => setNewTagihan({ ...newTagihan, bulan_tahun: e.target.value })} required />
            <input type="number" placeholder="Nominal (Rp)" className="field" value={newTagihan.jumlah_tagihan} onChange={(e) => setNewTagihan({ ...newTagihan, jumlah_tagihan: e.target.value })} required />
          </div>
          <button type="submit" className="primary-btn">Terbitkan Tagihan Bulan Ini</button>
        </form>

        <h3 className="mb-2 text-xs font-black text-slate-700">Status Kas Seluruh Warga</h3>
        <div className="space-y-3">
          {rekap.length === 0 ? (
            <EmptyState>Belum ada rekap iuran.</EmptyState>
          ) : rekap.map((r) => (
            <div key={r.id_iuran} className="surface-card flex items-center justify-between gap-3 p-3.5">
              <div>
                <p className="text-sm font-black text-slate-800">{r.nama_lengkap} <span className="text-xs font-semibold text-slate-400">({r.rt_rw})</span></p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Periode: {r.bulan_tahun} - Rp {Number(r.jumlah_tagihan).toLocaleString('id-ID')}</p>
              </div>
              <span className={`rounded-md px-2 py-1 text-[8px] font-black uppercase ${r.status_bayar === 'lunas' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{r.status_bayar}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
