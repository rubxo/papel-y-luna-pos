// Servidor simple para servir el frontend
const express = require('express');
const path = require('path');
const app = express();
const PORT = 5500;

// Middleware para garantizar UTF-8 en todo
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path.endsWith('.js') || req.path.endsWith('.css')) {
    const types = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css'
    };
    const ext = path.extname(req.path);
    res.setHeader('Content-Type', (types[ext] || 'text/plain') + '; charset=utf-8');
  }
  next();
});

// Servir archivos estáticos desde la raíz
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath);
    const types = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json'
    };
    if (types[ext]) {
      res.setHeader('Content-Type', types[ext] + '; charset=utf-8');
    }
  }
}));

// Ruta raíz
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback para todas las rutas
app.use((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌙 Frontend corriendo en http://localhost:${PORT}`);
  console.log(`🔌 Backend en http://localhost:8000`);
});
