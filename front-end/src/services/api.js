const BASE_URL = import.meta.env.VITE_API_BASE_URL
  || 'http://localhost/Pemrograman_Web/TUGASBESAR_Sirkula/back-end/api/';

export const apiRequest = async (endpoint, method = 'GET', body = null, customHeaders = {}) => {
  try {
    const isFormData = body instanceof FormData;
    const config = {
      method: method,
      headers: {
        'Accept': 'application/json',
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...customHeaders
      }
    };

    if (body && method !== 'GET') {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const result = await response.json().catch(() => ({}));
    
    return { status: response.status, data: result };
  } catch (error) {
    return {
      status: 0,
      data: {
        success: false,
        message: `Koneksi API gagal pada ${endpoint}`,
        data: [],
      },
      error,
    };
  }
};

export const apiUrl = (endpoint) => `${BASE_URL}${endpoint}`;

export const buktiLaporanUrl = (filename) => (
  filename ? `${BASE_URL.replace(/api\/?$/, '')}uploads/buktilaporan/${filename}` : ''
);
