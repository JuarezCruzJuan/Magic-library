import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Assents/css/Clasicos.css';

const Clasicos = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClassicBooks();
  }, []);

  const fetchClassicBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/books');
      // Filtrar solo los libros de la categoría Clásicos (ID: 2)
      const classicBooks = response.data.filter(book => book.categoria_id === 2);
      setBooks(classicBooks);
    } catch (error) {
      console.error('Error fetching classic books:', error);
      setError('Error al cargar los libros clásicos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="clasicos-container">
        <div className="loading">Cargando libros clásicos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clasicos-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="clasicos-container">
      <h1 className="clasicos-title">Libros Clásicos</h1>
      
      {books.length === 0 ? (
        <div className="no-books">
          <p>No hay libros clásicos disponibles en este momento.</p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-image-container">
                {book.imagen ? (
                  <img 
                    src={`data:image/jpeg;base64,${book.imagen}`} 
                    alt={book.titulo}
                    className="book-image"
                  />
                ) : (
                  <div className="no-image">
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.titulo}</h3>
                <p className="book-price">${book.precio}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clasicos;