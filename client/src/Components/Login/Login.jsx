import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import API_CONFIG from '../../config/api';
import '../../Assents/css/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/login`, formData);
      const { user } = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));

      if (user.rol === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.rol === 'cliente') {
        navigate('/user-dashboard');
      }
    } catch (error) {
      setError('Invalid email or password');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit">Login</button>
          <div className="form-actions">
            <button 
              type="button" 
              className="register-button"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
            <button 
              type="button" 
              className="recovery-button"
              onClick={() => navigate('/reset-password')}
            >
              ¿Olvidó su contraseña?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;