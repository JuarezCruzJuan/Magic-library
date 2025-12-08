// API Configuration
const API_CONFIG = {
  // En producción, prioriza REACT_APP_API_BASE_URL si está definida.
  BASE_URL:
    process.env.REACT_APP_API_BASE_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://magic-library.onrender.com/api'
      : 'http://localhost:4000/api')
};

export default API_CONFIG;
