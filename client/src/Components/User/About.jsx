import React from 'react'
import Nav from './Nav'
import Footer from './Footer'
import './About.css'

const About = () => {
  return (
    <>
      <Nav />
      <div className="about-container">
        <div className="about-header">
          <h1 className="about-title">
            <i className="fas fa-magic"></i>
            Magic Library
          </h1>
          <p className="about-subtitle">
            Donde cada libro es una puerta a mundos infinitos
          </p>
        </div>

        <div className="about-content">
          {/* Nuestra Historia */}
          <div className="about-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-book-open"></i>
              </div>
              <h2 className="section-title">Nuestra Historia</h2>
            </div>
            <div className="section-content">
              <p>
                Magic Library nació en 2018 con un sueño simple pero poderoso: crear un espacio donde los amantes de la literatura pudieran descubrir, explorar y disfrutar de los mejores libros del mundo. Fundada por un grupo de bibliófilos apasionados, nuestra librería comenzó como una pequeña tienda local que rápidamente se convirtió en el destino favorito de lectores de todas las edades.
              </p>
              <div className="company-story">
                <p>
                  "Creemos que cada libro tiene el poder de transformar vidas, abrir mentes y conectar corazones. En Magic Library, no solo vendemos libros; cultivamos experiencias literarias que perduran para toda la vida."
                </p>
                <p><strong>- Fundadores de Magic Library</strong></p>
              </div>
            </div>
          </div>

          {/* Nuestra Misión */}
          <div className="about-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h2 className="section-title">Nuestra Misión</h2>
            </div>
            <div className="section-content">
              <p>
                Nuestra misión es democratizar el acceso a la literatura de calidad, ofreciendo una experiencia de compra excepcional que inspire a las personas a leer más, aprender constantemente y expandir sus horizontes intelectuales. Nos comprometemos a:
              </p>
              <ul style={{fontSize: '1.1rem', lineHeight: '1.8', color: '#666'}}>
                <li>Proporcionar una selección cuidadosamente curada de libros de todos los géneros</li>
                <li>Ofrecer precios accesibles sin comprometer la calidad</li>
                <li>Brindar un servicio al cliente excepcional y personalizado</li>
                <li>Fomentar la comunidad lectora a través de eventos y recomendaciones</li>
                <li>Apoyar a autores emergentes y editoriales independientes</li>
              </ul>
            </div>
          </div>

          {/* Nuestra Visión */}
          <div className="about-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h2 className="section-title">Nuestra Visión</h2>
            </div>
            <div className="section-content">
              <p>
                Aspiramos a ser la librería en línea más querida y respetada de América Latina, reconocida por nuestra pasión por los libros, nuestro compromiso con la excelencia y nuestra contribución al crecimiento intelectual de la sociedad. Visualizamos un futuro donde:
              </p>
              <ul style={{fontSize: '1.1rem', lineHeight: '1.8', color: '#666'}}>
                <li>Cada hogar tenga acceso a una biblioteca diversa y enriquecedora</li>
                <li>La lectura sea una actividad central en la vida de las personas</li>
                <li>Los libros sigan siendo valorados como fuentes de sabiduría y entretenimiento</li>
                <li>Nuestra comunidad de lectores crezca y prospere globalmente</li>
              </ul>
            </div>
          </div>

          {/* Nuestros Valores */}
          <div className="about-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h2 className="section-title">Nuestros Valores</h2>
            </div>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-star"></i>
                </div>
                <h3 className="value-title">Excelencia</h3>
                <p className="value-description">
                  Nos esforzamos por la perfección en cada aspecto de nuestro servicio, desde la selección de libros hasta la experiencia del cliente.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3 className="value-title">Comunidad</h3>
                <p className="value-description">
                  Creemos en el poder de la comunidad lectora y trabajamos para conectar a personas a través de su amor compartido por los libros.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h3 className="value-title">Innovación</h3>
                <p className="value-description">
                  Constantemente buscamos nuevas formas de mejorar la experiencia de lectura y hacer que los libros sean más accesibles.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-handshake"></i>
                </div>
                <h3 className="value-title">Integridad</h3>
                <p className="value-description">
                  Operamos con transparencia, honestidad y respeto hacia nuestros clientes, autores y socios comerciales.
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="about-section stats-section">
            <div className="section-header">
              <div className="section-icon" style={{background: 'white', color: '#667eea'}}>
                <i className="fas fa-chart-bar"></i>
              </div>
              <h2 className="section-title">Nuestros Logros</h2>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">50,000+</span>
                <span className="stat-label">Libros en catálogo</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">25,000+</span>
                <span className="stat-label">Clientes satisfechos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100,000+</span>
                <span className="stat-label">Libros vendidos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5</span>
                <span className="stat-label">Años de experiencia</span>
              </div>
            </div>
          </div>

          {/* Nuestro Equipo */}
          <div className="about-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-users-cog"></i>
              </div>
              <h2 className="section-title">Nuestro Equipo</h2>
            </div>
            <div className="section-content">
              <p>
                Detrás de Magic Library hay un equipo apasionado de profesionales dedicados a hacer realidad nuestra visión. Cada miembro aporta su experiencia única y amor por los libros.
              </p>
            </div>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">
                  <i className="fas fa-user-tie"></i>
                </div>
                <h3 className="member-name">Ana García</h3>
                <p className="member-role">Directora General</p>
                <p className="member-description">
                  Con más de 15 años en el sector editorial, Ana lidera nuestra visión estratégica y relaciones con editoriales.
                </p>
              </div>
              <div className="team-member">
                <div className="member-avatar">
                  <i className="fas fa-book"></i>
                </div>
                <h3 className="member-name">Carlos Mendoza</h3>
                <p className="member-role">Curador de Contenido</p>
                <p className="member-description">
                  Experto en literatura con un ojo excepcional para seleccionar los mejores títulos para nuestros clientes.
                </p>
              </div>
              <div className="team-member">
                <div className="member-avatar">
                  <i className="fas fa-headset"></i>
                </div>
                <h3 className="member-name">María López</h3>
                <p className="member-role">Atención al Cliente</p>
                <p className="member-description">
                  Dedicada a brindar la mejor experiencia posible a cada cliente que visita Magic Library.
                </p>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="about-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h2 className="section-title">Contáctanos</h2>
            </div>
            <div className="section-content">
              <p>
                ¿Tienes preguntas, sugerencias o simplemente quieres charlar sobre libros? ¡Nos encantaría escucharte!
              </p>
            </div>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p>info@magiclibrary.com</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-details">
                  <h4>Teléfono</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-details">
                  <h4>Dirección</h4>
                  <p>123 Calle de los Libros, Ciudad Literaria</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="contact-details">
                  <h4>Horario</h4>
                  <p>Lun-Vie: 9:00-18:00, Sáb: 10:00-16:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About