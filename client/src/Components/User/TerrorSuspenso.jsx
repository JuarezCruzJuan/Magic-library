import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import '../../Assents/css/Clasicos.css';
import Nav from './Nav';
import Footer from './Footer';
import API_CONFIG from '../../config/api';

const TerrorSuspenso = () => {
  const { addToCart } = useCart();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchHorrorBooks();
  }, []);

  const fetchHorrorBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.BASE_URL}/books`);
      // Filtrar solo los libros de la categoría Terror y Suspenso (ID: 3)
      const horrorBooks = response.data.filter(book => book.categoria_id === 3);
      setBooks(horrorBooks);
    } catch (error) {
      console.error('Error fetching horror books:', error);
      setError('Error al cargar los libros de terror y suspenso');
    } finally {
      setLoading(false);
    }
  };

  const handleVerMas = (book) => {
    setSelectedBook(book);
  };

  const handleBack = () => {
    setSelectedBook(null);
  };

  const handleAddToCart = (book) => {
    addToCart(book);
    alert(`Libro "${book.titulo}" agregado al carrito`);
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="clasicos-container">
          <div className="loading">
            <i className="fas fa-spinner"></i>
            <p>Cargando libros de terror y suspenso...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav />
        <div className="clasicos-container">
          <div className="error">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button onClick={fetchHorrorBooks} className="retry-button">
              <i className="fas fa-redo"></i> Reintentar
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Modal para mostrar detalles del libro
  const renderModal = () => {
    if (!selectedBook) return null;

    return (
      <div className="modal-overlay" onClick={handleBack}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button onClick={handleBack} className="modal-close">
            <i className="fas fa-times"></i>
          </button>
          <div className="modal-body">
            <div className="modal-image">
              {selectedBook.imagen ? (
                <img 
                  src={selectedBook.imagen} 
                  alt={selectedBook.titulo}
                />
              ) : (
                <div className="no-image">
                  <i className="fas fa-book"></i>
                  <span>Sin imagen</span>
                </div>
              )}
            </div>
            <div className="modal-info">
              <h2>{selectedBook.titulo}</h2>
              <p className="book-author">por {selectedBook.autor || 'Desconocido'}</p>
              <p className="book-description">{selectedBook.descripcion || 'Sin descripción disponible'}</p>
              <p className="book-price-detail">${selectedBook.precio}</p>
              <p className="book-stock">
                <i className="fas fa-box"></i>
                {selectedBook.stock} unidades disponibles
              </p>
              <div className="modal-actions">
                <button onClick={handleBack} className="btn-back">
                  <i className="fas fa-arrow-left"></i> Volver
                </button>
                <button 
                  onClick={() => handleAddToCart(selectedBook)} 
                  className="btn-add-to-cart"
                  disabled={selectedBook.stock <= 0}
                >
                  <i className="fas fa-shopping-cart"></i>
                  {selectedBook.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Nav />
      <div className="clasicos-container">
        <div className="header">
          <h1>
            <i className="fas fa-skull"></i>
            Libros de Terror y Suspenso
          </h1>
        </div>
        {books.length === 0 ? (
          <div className="no-books">
            <i className="fas fa-book"></i>
            <p>No hay libros de terror y suspenso disponibles</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-image">
                  {book.imagen ? (
                    <img 
                      src={book.imagen} 
                      alt={book.titulo}
                    />
                  ) : (
                    <div className="no-image">
                      <i className="fas fa-book"></i>
                      <span>Sin imagen</span>
                    </div>
                  )}
                  {book.stock <= 0 && (
                    <div className="out-of-stock-overlay">
                      <span>Sin Stock</span>
                    </div>
                  )}
                </div>
                <div className="book-info">
                  <h3>{book.titulo}</h3>
                  <p className="book-author">{book.autor || 'Desconocido'}</p>
                  <p className="book-price">${book.precio}</p>
                  <p className="book-stock">
                    <i className="fas fa-box"></i>
                    Stock: {book.stock}
                  </p>
                  <div className="book-actions">
                    <button 
                      onClick={() => setSelectedBook(book)} 
                      className="view-button"
                    >
                      <i className="fas fa-eye"></i>
                      Ver más
                    </button>
                    <button 
                      onClick={() => handleAddToCart(book)} 
                      className="add-button"
                      disabled={book.stock <= 0}
                    >
                      <i className="fas fa-shopping-cart"></i>
                      {book.stock > 0 ? 'Agregar' : 'Sin stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {renderModal()}
      <Footer />
    </>
  );
};

export default TerrorSuspenso;