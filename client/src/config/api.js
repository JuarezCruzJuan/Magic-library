// API Configuration
const API_CONFIG = {
  // Cambia esta URL según el entorno
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://magic-library.onrender.com/api'
    : 'http://localhost:3001/api'
};

export default API_CONFIG;