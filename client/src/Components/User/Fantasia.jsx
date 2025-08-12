import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import '../../Assents/css/Clasicos.css';
import Nav from './Nav';
import Footer from './Footer';

const Fantasia = () => {
  const { addToCart } = useCart();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchFantasyBooks();
  }, []);

  const fetchFantasyBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/books');
      // Filtrar solo los libros de la categoría Fantasía (ID: 5)
      const fantasyBooks = response.data.filter(book => book.categoria_id === 5);
      setBooks(fantasyBooks);
    } catch (error) {
      console.error('Error fetching fantasy books:', error);
      setError('Error al cargar los libros de fantasía');
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
            <p>Cargando libros de fantasía...</p>
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
            <button onClick={fetchFantasyBooks} className="retry-button">
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
              <p className="book-author">por {selectedBook.autor}</p>
              <p className="book-description">{selectedBook.descripcion}</p>
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
        <h1 className="clasicos-title">
          <i className="fas fa-dragon"></i>
          Libros de Fantasía
        </h1>
        
        {books.length === 0 ? (
          <div className="no-books">
            <i className="fas fa-book-open"></i>
            <h3>No hay libros disponibles</h3>
            <p>No hay libros de fantasía disponibles en este momento.</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map(book => (
              <div key={book.id} className="book-card" onClick={() => handleVerMas(book)}>
                <div className="book-image-container">
                  {book.imagen ? (
                    <img 
                      src={book.imagen} 
                      alt={book.titulo}
                      className="book-image"
                    />
                  ) : (
                    <div className="no-image">
                      <i className="fas fa-book"></i>
                      <span>Sin imagen</span>
                    </div>
                  )}
                  {book.stock <= 0 && (
                    <div className="out-of-stock-overlay">
                      <i className="fas fa-times-circle"></i>
                      Sin stock
                    </div>
                  )}
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.titulo}</h3>
                  <p className="book-author">por {book.autor}</p>
                  <div className="book-details">
                    <span className="book-price">${book.precio}</span>
                    <span className="book-stock">
                      <i className="fas fa-box"></i>
                      {book.stock}
                    </span>
                  </div>
                  <div className="book-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerMas(book);
                      }} 
                      className="btn-ver-mas"
                    >
                      <i className="fas fa-eye"></i>
                      Ver más
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(book);
                      }} 
                      className="btn-agregar"
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
      <Footer />
      {renderModal()}
    </>
  );
};

export default Fantasia;