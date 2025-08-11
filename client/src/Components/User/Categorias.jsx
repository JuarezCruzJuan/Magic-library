import React from 'react'
import "../../Assents/css/Categorias.css";
import CateCien from "../../Assents/images/CateCien.jpg";
import Classics from "../../Assents/images/Classics.jpg";
import Horror from "../../Assents/images/Horror.jpg";
import Fantasy from "../../Assents/images/Fantasy.jpg";

const categorias = [
  { nombre: "Ciencia Ficción", imagen: CateCien },
  { nombre: "Clásicos", imagen: Classics },
  { nombre: "Terror y Suspenso", imagen: Horror },
  { nombre: "Fantasía", imagen: Fantasy } // Puedes cambiarlo
];

const Categorias = () => {
  return (
    <div className="categorias-container">
      {categorias.map((categoria, index) => (
        <div key={index} className="card">
          <img src={categoria.imagen} alt={categoria.nombre} className="card-img" />
          <h3 className="card-title">{categoria.nombre}</h3>
          <button>Ver mas</button>
        </div>
      ))}
    </div>
  );
};

export default Categorias