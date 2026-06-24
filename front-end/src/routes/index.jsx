import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Impor Komponen Layout
import MainLayout from '../layouts/MainLayout';

// Impor Kelompok Halaman Utama Auth
import LandingPage from '../pages/Auth/LandingPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';

// Impor Kelompok Halaman Fitur Warga
import BerandaWarga from '../pages/Warga/BerandaWarga';
import SampahWarga from '../pages/Warga/SampahWarga';
import IuranWarga from '../pages/Warga/IuranWarga';
import KebunWarga from '../pages/Warga/KebunWarga';
import LaporWarga from '../pages/Warga/LaporWarga';
import AkunWarga from '../pages/Warga/AkunWarga';

// Impor Kelompok Halaman Fitur Pengurus / Admin
import BerandaPengurus from '../pages/Pengurus/BerandaPengurus';
import SampahPengurus from '../pages/Pengurus/SampahPengurus';
import IuranPengurus from '../pages/Pengurus/IuranPengurus';
import KebunPengurus from '../pages/Pengurus/KebunPengurus';
import LaporPengurus from '../pages/Pengurus/LaporPengurus';
import AkunPengurus from '../pages/Pengurus/AkunPengurus';

export default function AppRoutes() {
  const { auth } = useAuth();

  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Jalur Terproteksi Dengan Bottom Navbar */}
      <Route element={<MainLayout />}>
        {/* Hak Akses Khusus: WARGA */}
        {auth.isLoggedIn && auth.role === 'warga' && (
          <>
            <Route path="/warga/dashboard" element={<BerandaWarga />} />
            <Route path="/warga/sampah" element={<SampahWarga />} />
            <Route path="/warga/iuran" element={<IuranWarga />} />
            <Route path="/warga/kebun" element={<KebunWarga />} />
            <Route path="/warga/lapor" element={<LaporWarga />} />
            <Route path="/warga/akun" element={<AkunWarga />} />
          </>
        )}

        {/* Hak Akses Khusus: PENGURUS */}
        {auth.isLoggedIn && auth.role === 'pengurus' && (
          <>
            <Route path="/pengurus/dashboard" element={<BerandaPengurus />} />
            <Route path="/pengurus/sampah" element={<SampahPengurus />} />
            <Route path="/pengurus/iuran" element={<IuranPengurus />} />
            <Route path="/pengurus/kebun" element={<KebunPengurus />} />
            <Route path="/pengurus/lapor" element={<LaporPengurus />} />
            <Route path="/pengurus/akun" element={<AkunPengurus />} />
          </>
        )}
      </Route>

      {/* Proteksi Terakhir: Tendang user tidak dikenal ke halaman login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
