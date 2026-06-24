import React, { useEffect, useState } from 'react';
import { Sprout } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import PageTitle from '../../components/PageTitle';
import StatusBar from '../../components/StatusBar';
import { apiRequest } from '../../services/api';

export default function KebunPengurus() {
  const [tanaman, setTanaman] = useState([]);
  const [newForm, setNewForm] = useState({ nama_tanaman: '', kategori_tanaman: 'Sayur', tanggal_tanam: '', perkiraan_panen: '' });

  const fetchKebunAdmin = async () => {
    const result = await apiRequest('pengurus/kebunpengurus.php', 'GET', null, { 'X-User-Role': 'pengurus' });
    setTanaman(result.data.data || []);
  };

  useEffect(() => { fetchKebunAdmin(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await apiRequest('pengurus/kebunpengurus.php', 'POST', newForm, { 'X-User-Role': 'pengurus' });
    if (res.status >= 200 && res.status < 300) {
      setNewForm({ nama_tanaman: '', kategori_tanaman: 'Sayur', tanggal_tanam: '', perkiraan_panen: '' });
      fetchKebunAdmin();
    }
  };

  const handleUpdateStatus = async (id_tanaman, status_tanaman, jumlah_stok) => {
    await apiRequest('pengurus/kebunpengurus.php', 'PUT', { id_tanaman, status_tanaman, jumlah_stok }, { 'X-User-Role': 'pengurus' });
    fetchKebunAdmin();
  };

  return (
    <div className="screen">
      <StatusBar />
      <div className="px-5 pb-20 pt-3">
        <PageTitle icon={Sprout} title="Kelola Kebun RT" subtitle="Daftarkan penanaman bibit baru dan kelola kuota panen." />

        <form onSubmit={handleCreate} className="surface-card mb-5 space-y-3 p-4">
          <input type="text" placeholder="Nama Tanaman (cth: Bayam)" className="field" value={newForm.nama_tanaman} onChange={(e) => setNewForm({ ...newForm, nama_tanaman: e.target.value })} required />
          <div className="grid grid-cols-3 gap-2">
            {['Sayur', 'Buah', 'Toga'].map((kat) => (
              <button key={kat} type="button" onClick={() => setNewForm({ ...newForm, kategori_tanaman: kat })} className={`h-9 rounded-xl text-xs font-black transition ${newForm.kategori_tanaman === kat ? 'bg-green-600 text-white' : 'border border-[#dce8f4] bg-white text-slate-500'}`}>{kat}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
            <div>
              <label className="mb-1 ml-1 block font-black">TANGGAL TANAM</label>
              <input type="date" className="field h-9 px-2" value={newForm.tanggal_tanam} onChange={(e) => setNewForm({ ...newForm, tanggal_tanam: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 ml-1 block font-black">ESTIMASI PANEN</label>
              <input type="date" className="field h-9 px-2" value={newForm.perkiraan_panen} onChange={(e) => setNewForm({ ...newForm, perkiraan_panen: e.target.value })} required />
            </div>
          </div>
          <button type="submit" className="h-10 w-full rounded-full bg-green-600 text-xs font-black text-white">Tanam Bibit Baru</button>
        </form>

        <div className="space-y-3">
          {tanaman.length === 0 ? (
            <EmptyState>Belum ada data tanaman.</EmptyState>
          ) : tanaman.map((t) => (
            <div key={t.id_tanaman} className="surface-card space-y-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-black text-slate-800">{t.nama_tanaman} ({t.kategori_tanaman})</h4>
                <span className="text-xs font-black text-green-600">{t.status_tanaman}</span>
              </div>
              <div className="flex gap-2">
                <select className="h-9 flex-1 rounded-lg border border-[#d9e5f1] bg-[#f8fbff] px-2 text-xs font-semibold outline-none" value={t.status_tanaman} onChange={(e) => handleUpdateStatus(t.id_tanaman, e.target.value, t.jumlah_stok)}>
                  <option value="Pembibitan">Pembibitan</option>
                  <option value="Tumbuh">Tumbuh</option>
                  <option value="Siap Panen">Siap Panen</option>
                  <option value="Sudah Panen">Sudah Panen</option>
                </select>
                <input type="number" className="h-9 w-20 rounded-lg border border-[#d9e5f1] bg-[#f8fbff] px-2 text-center text-xs font-black outline-none" placeholder="Stok" value={t.jumlah_stok} onChange={(e) => handleUpdateStatus(t.id_tanaman, t.status_tanaman, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
