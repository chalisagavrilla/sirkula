import React, { useEffect, useState } from 'react';
import { Calendar, Package, Sprout } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import PageTitle from '../../components/PageTitle';
import StatusBar from '../../components/StatusBar';
import { apiRequest } from '../../services/api';

export default function KebunWarga() {
  const [tanaman, setTanaman] = useState([]);

  useEffect(() => {
    const fetchKebun = async () => {
      const result = await apiRequest('warga/kebunwarga.php');
      setTanaman(result.data.data || []);
    };
    fetchKebun();
  }, []);

  return (
    <div className="screen">
      <StatusBar />
      <div className="px-5 pb-20 pt-3">
        <PageTitle icon={Sprout} title="Kebun Warga" subtitle="Pantau hasil bumi gratis di kebun komunitas RT/RW." />

        <div className="grid grid-cols-2 gap-3">
          {tanaman.length === 0 ? (
            <div className="col-span-2"><EmptyState>Belum ada data tanaman.</EmptyState></div>
          ) : tanaman.map((t) => (
            <div key={t.id_tanaman} className="surface-card flex min-h-[150px] flex-col justify-between p-4">
              <div>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-[8px] font-black uppercase ${
                    t.kategori_tanaman === 'Sayur' ? 'bg-green-100 text-green-600' : t.kategori_tanaman === 'Buah' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {t.kategori_tanaman}
                  </span>
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[8px] font-black text-[#1769e8]">{t.status_tanaman}</span>
                </div>
                <h4 className="text-sm font-black leading-tight text-slate-800">{t.nama_tanaman}</h4>
              </div>

              <div className="mt-4 space-y-1.5 border-t border-[#edf3fb] pt-3">
                <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400">
                  <Calendar size={12} />
                  <span>Panen: {t.perkiraan_panen}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-700">
                  <Package size={12} className="text-green-500" />
                  <span>Stok: {t.jumlah_stok} porsi</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
