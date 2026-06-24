import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import PageTitle from '../../components/PageTitle';
import StatusBar from '../../components/StatusBar';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

export default function SampahWarga() {
  const { auth } = useAuth();
  const [kategoriList, setKategoriList] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [inputData, setInputData] = useState({ id_kategori: '', berat_kg: '' });

  const fetchSampahData = async () => {
    const resKat = await apiRequest('warga/sampahwarga.php');
    setKategoriList(resKat.data.data || []);

    if (auth.wargaId) {
      const resHist = await apiRequest(`warga/sampahwarga.php?id_warga=${auth.wargaId}`);
      setRiwayat(resHist.data.data || []);
    }
  };

  useEffect(() => { fetchSampahData(); }, [auth.wargaId]);

  const handleAjukan = async (e) => {
    e.preventDefault();
    const response = await apiRequest(`warga/sampahwarga.php?id_warga=${auth.wargaId}`, 'POST', inputData);
    if (response.status >= 200 && response.status < 300) {
      setInputData({ id_kategori: '', berat_kg: '' });
      fetchSampahData();
      alert('Setoran berhasil diajukan!');
    }
  };

  return (
    <div className="screen">
      <StatusBar />
      <div className="px-5 pb-20 pt-3">
        <PageTitle icon={Trash2} title="Setor Sampah" subtitle="Pilih jenis sampah dan masukkan estimasi berat." />

        <form onSubmit={handleAjukan} className="surface-card mb-5 space-y-3 p-4">
          <select className="field" value={inputData.id_kategori} onChange={(e) => setInputData({ ...inputData, id_kategori: e.target.value })} required>
            <option value="">Pilih Kategori Sampah</option>
            {kategoriList.map((k) => <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori} (Rp {Number(k.harga_per_kg).toLocaleString('id-ID')}/kg)</option>)}
          </select>
          <input type="number" step="0.01" className="field" placeholder="Berat Sampah (Kg)" value={inputData.berat_kg} onChange={(e) => setInputData({ ...inputData, berat_kg: e.target.value })} required />
          <button type="submit" className="primary-btn">Ajukan Setoran</button>
        </form>

        <h3 className="mb-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Riwayat Setoran Anda</h3>
        <div className="space-y-3">
          {riwayat.length === 0 ? (
            <EmptyState>Belum ada riwayat setoran.</EmptyState>
          ) : riwayat.map((r) => (
            <div key={r.id_setoran} className="surface-card flex items-center justify-between p-3.5">
              <div>
                <p className="text-sm font-black text-slate-800">{r.nama_kategori} ({r.berat_kg} kg)</p>
                <p className="mt-0.5 text-[11px] font-black text-green-600">Est. Hasil: Rp {Number(r.total_pendapatan).toLocaleString('id-ID')}</p>
              </div>
              <span className={`rounded-md px-2 py-1 text-[8px] font-black uppercase ${r.status_verifikasi === 'diverifikasi' ? 'bg-green-100 text-green-600' : r.status_verifikasi === 'ditolak' ? 'bg-red-100 text-red-500' : 'bg-amber-100 text-amber-600'}`}>
                {r.status_verifikasi}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
