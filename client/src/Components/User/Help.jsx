import React, { useState } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import './Help.css';
//Este codigo le pertenecea Juan Jose Juarez Cruz

const Help = () => {
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxCharacters = 500;

  const handleChange = (e) => {
    const value = e.target.value;
    setComment(value);
    setErrorMessage("");
    setSuccessMessage("");
    
    if (value.length > maxCharacters) {
      setErrorMessage(`Has excedido el límite de ${maxCharacters} caracteres.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (comment.trim().length < 10) {
      setErrorMessage("El comentario debe tener al menos 10 caracteres.");
      return;
    }
    
    if (comment.length > maxCharacters) {
      setErrorMessage(`El comentario no puede exceder ${maxCharacters} caracteres.`);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simular envío del comentario
    setTimeout(() => {
      setSuccessMessage("¡Gracias por tu comentario! Lo hemos recibido correctamente y será revisado por nuestro equipo.");
      setComment("");
      setErrorMessage("");
      setIsSubmitting(false);
    }, 2000);
  };

  const handleClear = () => {
    setComment("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const getProgressColor = () => {
    const percentage = (comment.length / maxCharacters) * 100;
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return '';
  };

  const getCharacterCountColor = () => {
    const percentage = (comment.length / maxCharacters) * 100;
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return '';
  };

  return (
    <>
      <Nav />
      <div className="help-container">
        <div className="help-header">
          <h1 className="help-title">
            <i className="fas fa-comments"></i>
            Centro de Comentarios
          </h1>
          <p className="help-subtitle">
            Tu opinión es importante para nosotros. Comparte tus comentarios y sugerencias
          </p>
        </div>

        <div className="help-content">
          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <div className="success-content">
                <h3>¡Comentario enviado!</h3>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          {/* Formulario de comentarios */}
          <div className="comment-form-section">
            <div className="form-header">
              <div className="form-icon">
                <i className="fas fa-edit"></i>
              </div>
              <h2 className="form-title">Deja tu comentario</h2>
            </div>
            
            <p className="form-description">
              Nos encanta escuchar a nuestros lectores. Ya sea una sugerencia, una reseña de libro, 
              o cualquier comentario sobre nuestro servicio, tu opinión nos ayuda a mejorar cada día.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="comment-field">
                <label htmlFor="comment" className="comment-label">
                  <i className="fas fa-pen"></i>
                  Tu comentario
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  className={`comment-textarea ${errorMessage ? 'error' : ''}`}
                  value={comment}
                  onChange={handleChange}
                  placeholder="Comparte tu experiencia, sugerencias o cualquier comentario que tengas sobre Magic Library. Tu opinión es muy valiosa para nosotros..."
                  disabled={isSubmitting}
                />
              </div>

              {/* Contador de caracteres */}
              <div className="character-counter">
                <span className={`character-count ${getCharacterCountColor()}`}>
                  {comment.length} / {maxCharacters} caracteres
                </span>
                <span className="character-count">
                  {comment.length < 10 ? `Mínimo 10 caracteres (faltan ${10 - comment.length})` : '✓ Longitud válida'}
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${getProgressColor()}`}
                    style={{
                      width: `${Math.min((comment.length / maxCharacters) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Mensaje de error */}
              {errorMessage && (
                <div className="error-message">
                  <i className="fas fa-exclamation-triangle"></i>
                  {errorMessage}
                </div>
              )}

              {/* Botones de acción */}
              <div className="form-actions">
                <button
                  type="button"
                  className="clear-btn"
                  onClick={handleClear}
                  disabled={isSubmitting || comment.length === 0}
                >
                  <i className="fas fa-eraser"></i>
                  Limpiar
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting || comment.trim().length < 10 || comment.length > maxCharacters}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Enviar comentario
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Información adicional */}
          <div className="info-section">
            <div className="info-header">
              <div className="info-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <h3 className="info-title">¿Cómo podemos ayudarte?</h3>
            </div>
            <div className="info-content">
              <p>Tu feedback es fundamental para mejorar Magic Library. Aquí tienes algunas formas en las que puedes contribuir:</p>
              <ul className="info-list">
                <li>
                  <i className="fas fa-star"></i>
                  Comparte reseñas de libros que hayas leído
                </li>
                <li>
                  <i className="fas fa-lightbulb"></i>
                  Sugiere nuevos títulos para nuestro catálogo
                </li>
                <li>
                  <i className="fas fa-cog"></i>
                  Reporta problemas técnicos o errores
                </li>
                <li>
                  <i className="fas fa-heart"></i>
                  Cuéntanos qué te gusta más de nuestro servicio
                </li>
                <li>
                  <i className="fas fa-arrow-up"></i>
                  Propón mejoras para la experiencia de usuario
                </li>
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div className="faq-section">
            <div className="info-header">
              <div className="info-icon">
                <i className="fas fa-question-circle"></i>
              </div>
              <h3 className="info-title">Preguntas Frecuentes</h3>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <i className="fas fa-clock"></i>
                ¿Cuánto tiempo toma recibir una respuesta?
              </div>
              <div className="faq-answer">
                Normalmente respondemos a todos los comentarios dentro de 24-48 horas durante días laborables.
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <i className="fas fa-shield-alt"></i>
                ¿Mi información personal está segura?
              </div>
              <div className="faq-answer">
                Sí, todos los comentarios son tratados de forma confidencial y tu información personal está protegida según nuestras políticas de privacidad.
              </div>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <i className="fas fa-envelope"></i>
                ¿Puedo contactar directamente al equipo?
              </div>
              <div className="faq-answer">
                Por supuesto, también puedes escribirnos directamente a info@magiclibrary.com o visitar nuestra sección "Sobre nosotros" para más información de contacto.
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Help;