// CONFIGURACIÓN CENTRALIZADA — Papel & Luna POS

const CONFIG = {
  // Puerto del servidor solo para desarrollo local
  PORT: 8000,

  // URL del backend en producción (Render).
  // Reemplaza con la URL real que te asigne Render al desplegar.
  _productionApiUrl: "https://papel-y-luna-backend.onrender.com/api",

  // API_URL detecta automáticamente local vs producción
  get API_URL() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      return `http://localhost:${this.PORT}/api`;
    }
    // En producción: URL explícita de Render, o mismo origen (Railway/all-in-one)
    return this._productionApiUrl || `${location.origin}/api`;
  },

  get BASE_URL() {
    return `http://localhost:${this.PORT}`;
  },

  // Paleta "Papel & Luna" — mantener sincronizado con css/styles.css :root
  THEME: {
    COLOR_PRIMARY: "#3D6B9E",   // azul luna
    COLOR_SUCCESS: "#4A7C59",   // verde musgo
    COLOR_ERROR:   "#A63228",   // terracota
    COLOR_WARNING: "#B87333",   // cobre
    COLOR_INFO:    "#5B7FA6",
  },

  DEBUG_MODE: false,
};
