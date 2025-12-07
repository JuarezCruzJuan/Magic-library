const mysql = require('mysql2/promise');
require('dotenv').config();

// Detectar automáticamente si se debe usar SSL
// Se habilita si DB_SSL es 'true' O si el host es de TiDB Cloud
const useSSL = process.env.DB_SSL === 'true' || 
               (process.env.DB_HOST && process.env.DB_HOST.includes('tidb.cloud'));

console.log('Inicializando conexión a DB:', {
  host: process.env.DB_HOST ? '***' + process.env.DB_HOST.slice(-10) : 'undefined',
  user: process.env.DB_USER,
  ssl_enabled: useSSL
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'magiclibrary',
  port: process.env.DB_PORT || 3306,
  ssl: useSSL ? {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
