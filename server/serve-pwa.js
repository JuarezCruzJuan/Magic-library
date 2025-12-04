const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos de la PWA
app.use(express.static(path.join(__dirname, '../client/build')));

// Ruta para el service worker
app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/service-worker.js'));
});

// Ruta para el manifiesto
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/manifest.json'));
});

// Para cualquier otra ruta, servir el index.html (necesario para SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 PWA Server ejecutándose en http://localhost:${PORT}`);
  console.log(`📱 La PWA instalada usará esta URL como base`);
  console.log(`🔧 Asegúrate de que el servidor principal siga ejecutándose en el puerto 3001`);
});

module.exports = app;