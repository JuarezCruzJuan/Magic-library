import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import './ActivateAccount.css';

const ActivateAccount = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        // Obtener el token de la URL
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token) {
          setStatus('error');
          setMessage('Token de activación no proporcionado');
          return;
        }

        // Enviar solicitud al servidor para activar la cuenta
        const response = await axios.get(`${API_CONFIG.BASE_URL}/activate?token=${token}`);

        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message || 'Cuenta activada correctamente');
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Error al activar la cuenta');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Error al procesar la solicitud');
      }
    };

    activateAccount();
  }, [location]);

  const handleRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="activate-container">
      <div className="activate-box">
        <h2>Activación de Cuenta</h2>
        
        {status === 'loading' && (
          <div className="loading-message">
            <p>Procesando tu solicitud...</p>
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {status === 'success' && (
          <div className="success-message">
            <p>{message}</p>
            <button onClick={handleRedirect}>Ir al Login</button>
          </div>
        )}
        
        {status === 'error' && (
          <div className="error-message">
            <p>{message}</p>
            <button onClick={handleRedirect}>Volver al Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivateAccount;