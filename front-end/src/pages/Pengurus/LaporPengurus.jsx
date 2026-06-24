import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, HardHat, Paperclip } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import PageTitle from '../../components/PageTitle';
import StatusBar from '../../components/StatusBar';
import { useAuth } from '../../context/AuthContext';
import { apiRequest, buktiLaporanUrl } from '../../services/api';

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
const isImageFile = (filename = '') => imageExtensions.includes(filename.split('.').pop()?.toLowerCase());

const LampiranBukti = ({ filename }) => {
  if (!filename) return null;

  const fileUrl = buktiLaporanUrl(filename);
  if (isImageFile(filename)) {
    return (
      <a href={fileUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-[#dce8f4] bg-slate-50">
        <img src={fileUrl} alt="Bukti laporan warga" className="h-36 w-full object-cover" />
      </a>
    );
  }

  return (
    <a href={fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] font-black text-[#1769e8]">
      <Paperclip size={14} />
      <span className="truncate">{filename}</span>
    </a>
  );
};

export default function LaporPengurus() {
  const { auth } = useAuth();
  const [aduanList, setAduanList] = useState([]);

  const fetchSemuaAduan = async () => {
    const result = await apiRequest('pengurus/laporanpengurus.php', 'GET', null, { 'X-User-Role': 'pengurus' });
    setAduanList(result.data.data || []);
  };

  useEffect(() => { fetchSemuaAduan(); }, []);

  const handleUpdateStatus = async (id_laporan, status_laporan) => {
    const res = await apiRequest('pengurus/laporanpengurus.php', 'PUT', { id_laporan, status_laporan }, {
      'X-User-Role': 'pengurus',
      'X-Pengurus-ID': auth.pengurusId,
    });
    if (res.status >= 200 && res.status < 300) fetchSemuaAduan();
    else alert('Gagal merubah status laporan.');
  };

  return (
    <div className="screen">
      <StatusBar />
      <div className="px-5 pb-20 pt-3">
        <PageTitle icon={AlertCircle} title="Daftar Aduan Warga" subtitle="Validasi, tindak lanjuti, dan pantau keluhan infrastruktur warga." />

        <div className="space-y-4">
          {aduanList.length === 0 ? (
            <EmptyState>Bagus! Tidak ada keluhan fasilitas yang tertunda.</EmptyState>
          ) : aduanList.map((item) => (
            <div key={item.id_laporan} className="surface-card space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[8px] font-black uppercase tracking-wide text-slate-400">Pelapor: {item.nama_warga} ({item.rt_rw})</span>
                  <h4 className="mt-0.5 text-sm font-black leading-snug text-slate-800">{item.judul_laporan}</h4>
                </div>
                <span className={`shrink-0 rounded px-2 py-0.5 text-[8px] font-black uppercase ${
                  item.status_laporan === 'selesai' ? 'bg-green-100 text-green-600' : item.status_laporan === 'proses' ? 'bg-blue-100 text-[#1769e8]' : 'bg-amber-100 text-amber-600'
                }`}>
                  {item.status_laporan}
                </span>
              </div>

              <p className="rounded-xl bg-[#f8fbff] p-3 text-xs font-medium leading-relaxed text-slate-500">{item.deskripsi}</p>
              <LampiranBukti filename={item.foto_bukti} />

              {item.status_laporan !== 'selesai' && (
                <div className="flex gap-2 pt-1">
                  {item.status_laporan === 'pending' && (
                    <button onClick={() => handleUpdateStatus(item.id_laporan, 'proses')} className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-blue-50 text-[10px] font-black text-[#1769e8]">
                      <HardHat size={12} /> Proses Perbaikan
                    </button>
                  )}
                  <button onClick={() => handleUpdateStatus(item.id_laporan, 'selesai')} className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-green-600 text-[10px] font-black text-white">
                    <Check size={12} /> Tandai Selesai
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
