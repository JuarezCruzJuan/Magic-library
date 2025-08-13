import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config/api';
import '../../Assents/css/RegisterAdmi.css';

const RegisterAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post(`${API_CONFIG.BASE_URL}/admin/register`, {
        ...formData,
        rol: 'admin'
      });
      alert('Admin registered successfully');
      navigate('/admin-dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Error registering admin');
    }
  };

  return (
    <div className="register-admin-container">
      <div className="register-admin-box">
        <h2>Register New Admin</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="nombre"
              placeholder="Name"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
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
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Register Admin</button>
          <button 
            type="button" 
            className="back-button"
            onClick={() => navigate('/admin-dashboard')}
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterAdmin;