import { apiRequest } from "./api";

export const dataService = {
  // Fitur Dashboard Agregat
  getWargaDashboard: async (id_warga) => {
    return await apiRequest(`warga/dashboardwarga.php?id_warga=${id_warga}`);
  },
  getPengurusDashboard: async () => {
    return await apiRequest("pengurus/dashboardpengurus.php", "GET", null, {
      "X-User-Role": "pengurus",
    });
  },

  // Fitur Modul Kebun Komunitas
  getKebunWarga: async () => {
    return await apiRequest("warga/kebunwarga.php");
  },
  updateKebunAdmin: async (payload) => {
    return await apiRequest("pengurus/kebunpengurus.php", "PUT", payload, {
      "X-User-Role": "pengurus",
    });
  },
};
