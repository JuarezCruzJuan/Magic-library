import React from 'react';
import Nav from './Nav';
import Footer from './Footer';
import './Suscripcion.css';

const Suscripcion = () => {
  const planes = [
    {
      id: 1,
      nombre: "Básico",
      precio: "$99",
      color: "#4299e1", // Azul
      caracteristicas: [
        "Acceso a 10 libros al mes",
        "Descarga en 1 dispositivo",
        "Soporte por email",
        "Acceso a eventos virtuales"
      ]
    },
    {
      id: 2,
      nombre: "Avanzado",
      precio: "$199",
      color: "#805ad5", // Morado
      destacado: true,
      caracteristicas: [
        "Acceso a 25 libros al mes",
        "Descarga en 3 dispositivos",
        "Soporte prioritario",
        "Acceso a eventos virtuales y presenciales",
        "Descuentos en compras"
      ]
    },
    {
      id: 3,
      nombre: "Premium",
      precio: "$299",
      color: "#e53e3e", // Rojo
      caracteristicas: [
        "Acceso ilimitado a libros",
        "Descarga en 5 dispositivos",
        "Soporte 24/7",
        "Acceso VIP a eventos",
        "Descuentos exclusivos en compras",
        "Envío gratuito de libros físicos"
      ]
    }
  ];

  const handleSuscripcion = (plan) => {
    alert(`Has seleccionado el plan ${plan.nombre}. Esta funcionalidad estará disponible próximamente.`);
  };

  return (
    <div className="suscripcion-page">
      <Nav />
      <div className="suscripcion-container">
        <div className="suscripcion-header">
          <h1>Planes de Suscripción</h1>
          <p>Elige el plan que mejor se adapte a tus necesidades de lectura</p>
        </div>

        <div className="planes-container">
          {planes.map((plan) => (
            <div 
              key={plan.id} 
              className={`plan-card ${plan.destacado ? 'destacado' : ''}`}
              style={{
                '--plan-color': plan.color
              }}
            >
              {plan.destacado && <div className="plan-badge">Más popular</div>}
              <div className="plan-header">
                <h2>{plan.nombre}</h2>
                <div className="plan-precio">
                  <span className="precio">{plan.precio}</span>
                  <span className="periodo">/mes</span>
                </div>
              </div>
              <div className="plan-caracteristicas">
                <ul>
                  {plan.caracteristicas.map((caracteristica, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i>
                      {caracteristica}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                className="plan-button"
                onClick={() => handleSuscripcion(plan)}
              >
                Suscribirse
              </button>
            </div>
          ))}
        </div>

        <div className="suscripcion-info">
          <h3>¿Por qué suscribirte a Magic Library?</h3>
          <div className="info-cards">
            <div className="info-card">
              <i className="fas fa-book"></i>
              <h4>Amplio catálogo</h4>
              <p>Miles de libros de todas las categorías disponibles para ti</p>
            </div>
            <div className="info-card">
              <i className="fas fa-mobile-alt"></i>
              <p>Lee en cualquier dispositivo, en cualquier momento</p>
            </div>
            <div className="info-card">
              <i className="fas fa-tags"></i>
              <h4>Descuentos exclusivos</h4>
              <p>Obtén descuentos especiales en compras de libros físicos</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Suscripcion;