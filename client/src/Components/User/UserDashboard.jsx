import React from 'react';
import Nav from './Nav';
import PromoSlider from './PromoSlider';
import Categorias from './Categorias';
import Footer from './Footer';
import './UserDashboard.css';
//Este codigo le pertenecea Juan Jose Juarez Cruz

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      <Nav />
      <div className="dashboard-content">
        <div className="promo-slider-container">
          <div className="promo-slider-wrapper">
            <h2 className="promo-slider-title">Descubre Nuestras Promociones</h2>
            <PromoSlider />
          </div>
        </div>
        
        <div className="categorias-container">
          <div className="categorias-wrapper">
            <h2 className="categorias-title">Explora Nuestras Categorías</h2>
            <Categorias />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard