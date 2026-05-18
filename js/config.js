// CONFIGURACIÓN CENTRALIZADA - Papel & Luna

const CONFIG = {
  // Puerto del servidor (solo para desarrollo local)
  PORT: 8000,

  // URL del backend en producción.
  // Si el frontend y backend están en el mismo servidor (Railway), dejar null.
  // Si están separados (Netlify + Railway), poner la URL de Railway aquí:
  //   _productionApiUrl: "https://tu-backend.up.railway.app/api"
  _productionApiUrl: null,

  // API ENDPOINT — detecta automáticamente local vs producción
  get API_URL() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      return `http://localhost:${this.PORT}/api`;
    }
    // En producción: si hay URL explícita, usarla; si no, usar mismo origen (Railway all-in-one)
    return this._productionApiUrl || `${location.origin}/api`;
  },

  get BASE_URL() {
    return `http://localhost:${this.PORT}`;
  },

  THEME: {
    COLOR_PRIMARY: "#667eea",
    COLOR_SECONDARY: "#764ba2",
    COLOR_SUCCESS: "#10b981",
    COLOR_ERROR: "#ef4444",
    COLOR_WARNING: "#f59e0b",
  },

  DEBUG_MODE: false,
};
