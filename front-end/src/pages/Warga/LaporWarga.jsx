import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Paperclip } from 'lucide-react';
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
        <img src={fileUrl} alt="Bukti laporan" className="h-36 w-full object-cover" />
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

export default function LaporWarga() {
  const { auth } = useAuth();
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [fileGambar, setFileGambar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLaporanWarga = async () => {
    if (!auth.wargaId) return;
    const result = await apiRequest(`warga/laporanwarga.php?id_warga=${auth.wargaId}`);
    setRiwayat(result.data.data || []);
  };

  useEffect(() => { fetchLaporanWarga(); }, [auth.wargaId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileGambar(file);
      setPreviewUrl(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
    }
  };

  const handleKirimLaporan = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('judul_laporan', judul);
    formData.append('deskripsi', deskripsi);
    if (fileGambar) formData.append('foto_bukti', fileGambar);

    try {
      const res = await apiRequest(`warga/laporanwarga.php?id_warga=${auth.wargaId}`, 'POST', formData);
      if (res.status >= 200 && res.status < 300) {
        setJudul('');
        setDeskripsi('');
        setFileGambar(null);
        setPreviewUrl(null);
        fetchLaporanWarga();
        alert('Laporan aduan Anda berhasil terkirim ke Pengurus!');
      } else {
        alert('Gagal mengirim laporan, periksa kembali format file.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <StatusBar />
      <div className="px-5 pb-20 pt-3">
        <PageTitle icon={AlertCircle} title="Lapor Fasilitas" subtitle="Laporkan kendala kerusakan sarana prasarana lingkungan sekitar." />

        <form onSubmit={handleKirimLaporan} className="surface-card mb-5 space-y-3.5 p-4">
          <div>
            <label className="mb-1 block text-[9px] font-black uppercase tracking-wider text-slate-600">Judul Keluhan</label>
            <input type="text" placeholder="Cth: Tiang Listrik RT 02 Goyang" className="field" value={judul} onChange={(e) => setJudul(e.target.value)} required />
          </div>

          <div>
            <label className="mb-1 block text-[9px] font-black uppercase tracking-wider text-slate-600">Deskripsi Kerusakan & Lokasi</label>
            <textarea placeholder="Tuliskan detail kronologi atau titik lokasi kerusakan prasarana agar mudah dilacak pengurus..." className="min-h-20 w-full resize-none rounded-xl border border-[#d9e5f1] bg-[#f8fbff] p-3 text-xs font-semibold leading-relaxed outline-none focus:border-[#1769e8] focus:bg-white" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required />
          </div>

          <div>
            <label className="mb-1 block text-[9px] font-black uppercase tracking-wider text-slate-600">Lampiran Bukti</label>
            <label className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#c7d7e8] bg-white text-xs font-black text-slate-400 transition hover:bg-slate-50">
              <Paperclip size={16} className="shrink-0 text-[#1769e8]" />
              <span className="max-w-[230px] truncate">{fileGambar ? fileGambar.name : 'Unggah file bukti'}</span>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
            {fileGambar && !previewUrl && (
              <p className="mt-2 rounded-xl bg-blue-50 px-3 py-2 text-[10px] font-bold text-[#1769e8]">
                File siap dikirim: {fileGambar.name}
              </p>
            )}
          </div>

          {previewUrl && (
            <div className="h-32 w-full overflow-hidden rounded-xl border border-[#dce8f4] bg-black/5">
              <img src={previewUrl} alt="Preview Bukti" className="h-full w-full object-cover" />
            </div>
          )}

          <button type="submit" disabled={loading} className="primary-btn disabled:opacity-50">
            {loading ? 'Mengirim Aduan...' : 'Kirim Pengaduan'}
          </button>
        </form>

        <h3 className="mb-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Status Penanganan Aduan</h3>
        <div className="space-y-3">
          {riwayat.length === 0 ? (
            <EmptyState>Belum ada riwayat laporan yang dibuat.</EmptyState>
          ) : riwayat.map((l) => (
            <div key={l.id_laporan} className="surface-card space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-black leading-tight text-slate-800">{l.judul_laporan}</h4>
                <span className={`flex shrink-0 items-center gap-1 rounded px-2 py-0.5 text-[8px] font-black uppercase ${
                  l.status_laporan === 'selesai' ? 'bg-green-100 text-green-600' : l.status_laporan === 'proses' ? 'bg-blue-100 text-[#1769e8]' : 'bg-amber-100 text-amber-600'
                }`}>
                  {l.status_laporan === 'selesai' ? <CheckCircle2 size={10} /> : l.status_laporan === 'proses' ? <Clock size={10} /> : <AlertCircle size={10} />}
                  {l.status_laporan}
                </span>
              </div>
              <p className="text-xs font-medium leading-relaxed text-slate-500">{l.deskripsi}</p>
              <LampiranBukti filename={l.foto_bukti} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
