import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    role: null, // 'warga' atau 'pengurus'
    userId: null,
    wargaId: null,
    pengurusId: null,
    nama: '',
    profile: null
  });

  // Sinkronisasi dengan localStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    const savedAuth = localStorage.getItem('sirkula_session');
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
  }, []);

  const loginGlobal = (userData) => {
    const sessionData = {
      isLoggedIn: true,
      role: userData.role,
      userId: userData.id_user,
      wargaId: userData.role === 'warga' ? userData.profile.id_warga : null,
      pengurusId: userData.role === 'pengurus' ? userData.profile.id_pengurus : null,
      nama: userData.profile.nama_lengkap,
      profile: userData.profile
    };
    setAuth(sessionData);
    localStorage.setItem('sirkula_session', JSON.stringify(sessionData));
  };

  const logoutGlobal = () => {
    setAuth({ isLoggedIn: false, role: null, userId: null, wargaId: null, pengurusId: null, nama: '', profile: null });
    localStorage.removeItem('sirkula_session');
  };

  return (
    <AuthContext.Provider value={{ auth, loginGlobal, logoutGlobal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
