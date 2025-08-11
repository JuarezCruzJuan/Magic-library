import React, { useState } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
//Este codigo le pertenecea Juan Jose Juarez Cruz

const Help = () => {
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const maxCharacters = 200;

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length <= maxCharacters) {
      setComment(value);
      setErrorMessage("");
    } else {
      setErrorMessage(`Has excedido el límite de ${maxCharacters} caracteres.`);
    }
  };

  return (
    <div>
      <Nav /><br/>
   
    <div className="container">
         
      <h2>Comentarios</h2>
      <form>
        {/* Cuadro de texto para comentarios */}
        <div className="mb-3">
          <label htmlFor="comment" className="form-label">
            Deja tu comentario:
          </label>
          <textarea
            id="comment"
            name="comment"
            className={`form-control ${errorMessage ? "is-invalid" : ""}`}
            rows="5"
            value={comment}
            onChange={handleChange}
            maxLength={maxCharacters}
            placeholder="Escribe tu comentario aquí..."
          />
          {/* Mensaje de error si el texto excede los 200 caracteres */}
          {errorMessage && (
            <div className="invalid-feedback">{errorMessage}</div>
          )}
        </div>

        {/* Barra de progreso para mostrar los caracteres restantes */}
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <span>
              {comment.length} / {maxCharacters} caracteres
            </span>
          </div>
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${(comment.length / maxCharacters) * 100}%`,
              }}
              aria-valuenow={comment.length}
              aria-valuemin="0"
              aria-valuemax={maxCharacters}
            ></div>
          </div>
        </div>
      </form>
    </div>
    <Footer />
    </div>
  );
};

export default Help;