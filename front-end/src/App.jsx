import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}