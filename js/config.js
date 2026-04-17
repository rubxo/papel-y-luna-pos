// ⚙️ CONFIGURACIÓN CENTRALIZADA - Papel & Luna

const CONFIG = {
  // 🔌 PUERTO DEL SERVIDOR

  PORT: 8000,

  // 📍 URL BASE DE LA APLICACIÓN
  get BASE_URL() {
    return `http://localhost:${this.PORT}`;
  },

  // 🌐 API ENDPOINT (Google Sheets)
  API_URL: "https://script.google.com/macros/s/AKfycbxang0QOYogbAKi70PYsVt6uRaqn9ih0P_pNz2N0RPRIyVJetLmeDoBe4-wwTzYZN6N6g/exec",

  // 🎨 TEMAS Y ESTILOS
  THEME: {
    COLOR_PRIMARY: "#667eea",
    COLOR_SECONDARY: "#764ba2",
    COLOR_SUCCESS: "#10b981",
    COLOR_ERROR: "#ef4444",
    COLOR_WARNING: "#f59e0b",
  },

  // 📝 CONFIGURACIÓN DE LOGS
  DEBUG_MODE: false, // Cambiar a true para ver más logs en consola
};

// Ejemplo de uso:
// CONFIG.PORT -> 8000
// CONFIG.BASE_URL -> http://localhost:8000
// CONFIG.API_URL -> URL de Google Sheets
