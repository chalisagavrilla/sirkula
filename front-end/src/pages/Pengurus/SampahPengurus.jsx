import React, { useEffect, useState } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import PageTitle from '../../components/PageTitle';
import StatusBar from '../../components/StatusBar';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

export default function SampahPengurus() {
  const { auth } = useAuth();
  const [antrean, setAntrean] = useState([]);

  const fetchQueue = async () => {
    const result = await apiRequest('pengurus/sampahpengurus.php', 'GET', null, { 'X-User-Role': 'pengurus' });
    setAntrean(result.data.data || []);
  };

  useEffect(() => { fetchQueue(); }, []);

  const handleVerifikasi = async (id_setoran, status_verifikasi) => {
    const response = await apiRequest('pengurus/sampahpengurus.php', 'PUT', { id_setoran, status_verifikasi }, {
      'X-User-Role': 'pengurus',
      'X-Pengurus-ID': auth.pengurusId,
    });
    if (response.status >= 200 && response.status < 300) fetchQueue();
  };

  return (
    <div className="screen">
      <StatusBar />
      <div className="px-5 pb-20 pt-3">
        <PageTitle icon={Trash2} title="Verifikasi Sampah" subtitle="Setujui atau tolak pengajuan timbangan bank sampah warga." />
        <div className="space-y-3">
          {antrean.length === 0 ? (
            <EmptyState>Belum ada antrean setoran.</EmptyState>
          ) : antrean.map((item) => (
            <div key={item.id_setoran} className="surface-card flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-[10px] font-semibold text-slate-400">Warga: {item.nama_warga}</p>
                <h4 className="mt-0.5 text-sm font-black text-slate-800">{item.nama_kategori} - {item.berat_kg} Kg</h4>
                <p className="mt-1 text-xs font-black text-[#1769e8]">Nilai: Rp {Number(item.total_pendapatan).toLocaleString('id-ID')}</p>
              </div>
              {item.status_verifikasi === 'pending' ? (
                <div className="flex gap-2">
                  <button onClick={() => handleVerifikasi(item.id_setoran, 'diverifikasi')} className="rounded-xl bg-green-100 p-2 text-green-600"><Check size={16} /></button>
                  <button onClick={() => handleVerifikasi(item.id_setoran, 'ditolak')} className="rounded-xl bg-red-100 p-2 text-red-500"><X size={16} /></button>
                </div>
              ) : (
                <span className={`rounded-md px-2 py-1 text-[8px] font-black uppercase ${item.status_verifikasi === 'diverifikasi' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{item.status_verifikasi}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
