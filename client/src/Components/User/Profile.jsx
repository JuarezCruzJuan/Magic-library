import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from './Nav';
import Footer from './Footer';
import './Profile.css';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      // Cargar órdenes desde localStorage
      const savedOrders = JSON.parse(localStorage.getItem('user-orders') || '[]');
      setOrders(savedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'processing': return 'Procesando';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'processing': return 'status-processing';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const getUserInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <>
      <Nav />
      <div className="profile-container">
        <div className="container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {getUserInitials(user.nombre)}
              </div>
              <h2>Mi Perfil</h2>
            </div>
            <div className="profile-body">
              {/* Información Personal */}
              <div className="info-section">
                <h4>
                  <i className="fas fa-user"></i>
                  Información Personal
                </h4>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-id-card"></i>
                    Nombre:
                  </div>
                  <div className="info-value">{user.nombre || 'No especificado'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-envelope"></i>
                    Email:
                  </div>
                  <div className="info-value">{user.email || 'No especificado'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-user-tag"></i>
                    Rol:
                  </div>
                  <div className="info-value">{user.role || 'Usuario'}</div>
                </div>
              </div>

              {/* Órdenes de Compra */}
              <div className="orders-section">
                <div className="orders-header">
                  <h4>
                    <i className="fas fa-shopping-bag"></i>
                    Mis Órdenes
                  </h4>
                  <span className="orders-count">{orders.length}</span>
                </div>
                
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-id">Orden #{order.id}</div>
                        <span className={`order-status ${getStatusClass(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      
                      <div className="order-details">
                        <div className="order-detail">
                          <div className="order-detail-label">Fecha</div>
                          <div className="order-detail-value">
                            {new Date(order.date).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                        <div className="order-detail">
                          <div className="order-detail-label">Total</div>
                          <div className="order-detail-value">${order.total.toFixed(2)}</div>
                        </div>
                        <div className="order-detail">
                          <div className="order-detail-label">Artículos</div>
                          <div className="order-detail-value">{order.items.length} libro(s)</div>
                        </div>
                      </div>
                      
                      <div className="order-items">
                        <h6>Detalles de la orden:</h6>
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <div className="item-info">
                              <div className="item-title">{item.title}</div>
                              <div className="item-quantity">Cantidad: {item.quantity}</div>
                            </div>
                            <div className="item-price">${item.price.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-orders">
                    <i className="fas fa-shopping-cart"></i>
                    <h5>No tienes órdenes aún</h5>
                    <p>Cuando realices tu primera compra, aparecerá aquí.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;