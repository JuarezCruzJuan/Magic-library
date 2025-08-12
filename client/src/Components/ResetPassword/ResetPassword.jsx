import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../Assents/css/Register.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Obtener el token de la URL (query parameter)
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [location]);

  const validatePassword = (password) => {
    const errors = [];
    
    // 1. Longitud mínima de 8 caracteres
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    // 2. Utilizar mínimo una mayúscula
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }
    
    // 3. Utilizar mínimo una minúscula
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }
    
    // 4. Utilizar mínimo un carácter especial
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    }
    
    // 5. No permitir números consecutivos
    for (let i = 0; i < password.length - 1; i++) {
      if (
        !isNaN(parseInt(password[i])) && 
        !isNaN(parseInt(password[i+1])) && 
        parseInt(password[i]) + 1 === parseInt(password[i+1])
      ) {
        errors.push('La contraseña no debe contener números consecutivos');
        break;
      }
    }
    
    // 6. No permitir letras consecutivas
    const lowerPassword = password.toLowerCase();
    for (let i = 0; i < lowerPassword.length - 1; i++) {
      if (
        lowerPassword[i] >= 'a' && lowerPassword[i] <= 'z' &&
        lowerPassword[i+1] >= 'a' && lowerPassword[i+1] <= 'z' &&
        lowerPassword[i].charCodeAt(0) + 1 === lowerPassword[i+1].charCodeAt(0)
      ) {
        errors.push('La contraseña no debe contener letras consecutivas del abecedario');
        break;
      }
    }
    
    return errors;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordErrors(validatePassword(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validar token
    if (!token) {
      setMessage('Token de recuperación no válido');
      return;
    }

    // Validar contraseña
    const errors = validatePassword(newPassword);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/reset-password', {
        token,
        newPassword
      });

      if (response.data.success) {
        setIsSuccess(true);
        setMessage('Contraseña actualizada correctamente');
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al restablecer la contraseña');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Restablecer Contraseña</h2>
        {message && (
          <div className={isSuccess ? "recovery-message" : "error-message"}>
            {message}
          </div>
        )}
        {passwordErrors.length > 0 && (
          <div className="password-errors">
            <ul>
              {passwordErrors.map((err, index) => (
                <li key={index} className="error-message">{err}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              placeholder="Nueva Contraseña"
              value={newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirmar Nueva Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Restablecer Contraseña</button>
          <button 
            type="button" 
            className="login-button"
            onClick={() => navigate('/login')}
          >
            Volver al Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;