import React from 'react'
import { useNavigate } from 'react-router-dom';
import "../../Assents/css/Categorias.css";
import CateCien from "../../Assents/images/CateCien.jpg";
import Classics from "../../Assents/images/Classics.jpg";
import Horror from "../../Assents/images/Horror.jpg";
import Fantasy from "../../Assents/images/Fantasy.jpg";

const categorias = [
  { 
    nombre: "Ciencia Ficción", 
    imagen: CateCien, 
    ruta: "/ciencia-ficcion",
    descripcion: "Explora mundos futuristas, tecnología avanzada y aventuras espaciales que desafían los límites de la imaginación."
  },
  { 
    nombre: "Clásicos", 
    imagen: Classics, 
    ruta: "/clasicos",
    descripcion: "Descubre las obras maestras de la literatura universal que han marcado generaciones y siguen siendo relevantes."
  },
  { 
    nombre: "Terror y Suspenso", 
    imagen: Horror, 
    ruta: "/terror-suspenso",
    descripcion: "Sumérgete en historias escalofriantes que te mantendrán al borde del asiento con cada página."
  },
  { 
    nombre: "Fantasía", 
    imagen: Fantasy, 
    ruta: "/fantasia",
    descripcion: "Adéntrate en reinos mágicos llenos de criaturas fantásticas, hechizos y aventuras épicas."
  }
];

const Categorias = () => {
  const navigate = useNavigate();

  const handleVerMas = (ruta) => {
    navigate(ruta);
  };

  return (
    <div className="categorias-grid">
      {categorias.map((categoria, index) => (
        <div key={index} className="categoria-card">
          <img 
            src={categoria.imagen} 
            alt={categoria.nombre} 
            className="categoria-image" 
          />
          <h3 className="categoria-name">{categoria.nombre}</h3>
          <p className="categoria-description">{categoria.descripcion}</p>
          <button 
            className="categoria-button"
            onClick={() => handleVerMas(categoria.ruta)}
          >
            <i className="fas fa-book-open"></i>
            Explorar Categoría
          </button>
        </div>
      ))}
    </div>
  );
};

export default Categorias;