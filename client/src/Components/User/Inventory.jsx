import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import Nav from './Nav';
import Footer from './Footer';
import './Inventory.css';

const Inventory = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchAllBooks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBooks(books);
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      // Filtrar libros que coincidan con el término de búsqueda
      const filtered = books.filter(book => 
        book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.autor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
      
      // Generar sugerencias
      const bookSuggestions = books
        .filter(book => 
          book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.autor.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5) // Limitar a 5 sugerencias
        .map(book => ({
          id: book.id,
          text: book.titulo,
          type: 'title'
        }));
      
      const authorSuggestions = books
        .filter(book => book.autor.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 3)
        .map(book => ({
          id: `author-${book.autor}`,
          text: book.autor,
          type: 'author'
        }));
      
      // Eliminar duplicados de autores
      const uniqueAuthors = authorSuggestions.filter((author, index, self) => 
        index === self.findIndex(a => a.text === author.text)
      );
      
      setSuggestions([...bookSuggestions, ...uniqueAuthors]);
      setShowSuggestions(searchTerm.length > 0);
    }
  }, [searchTerm, books]);

  const fetchAllBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/books');
      setBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Error al cargar el inventario de libros');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    // La búsqueda ya se maneja en el useEffect
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'title') {
      setSearchTerm(suggestion.text);
    } else if (suggestion.type === 'author') {
      setSearchTerm(suggestion.text);
    }
    setShowSuggestions(false);
  };

  const handleAddToCart = (book) => {
    addToCart(book);
    // Opcional: mostrar notificación de éxito
    alert(`"${book.titulo}" ha sido agregado al carrito`);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="inventory-container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Cargando inventario...</p>
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
        <div className="inventory-container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button onClick={fetchAllBooks} className="retry-button">
              Intentar nuevamente
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Modal para mostrar detalles del libro
  if (selectedBook) {
    return (
      <>
        <Nav />
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
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
                <p className="book-author"><strong>Autor:</strong> {selectedBook.autor}</p>
                <p className="book-description">{selectedBook.descripcion}</p>
                <p className="book-price-detail"><strong>Precio:</strong> ${selectedBook.precio}</p>
                <p className="book-stock"><strong>Stock:</strong> {selectedBook.stock} unidades</p>
                <button 
                  onClick={() => handleAddToCart(selectedBook)} 
                  className="add-to-cart-button"
                  disabled={selectedBook.stock <= 0}
                >
                  {selectedBook.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="inventory-container">
        <div className="inventory-header">
          <h1 className="inventory-title">
            <i className="fas fa-warehouse"></i>
            Inventario Completo
          </h1>
          <p className="inventory-subtitle">
            Explora nuestra colección completa de {books.length} libros
          </p>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="search-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Buscar por título o autor..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
                autoComplete="off"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            
            {/* Sugerencias */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={`${suggestion.id}-${index}`}
                    className={`suggestion-item ${suggestion.type}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <i className={`fas ${suggestion.type === 'title' ? 'fa-book' : 'fa-user'}`}></i>
                    <span>{suggestion.text}</span>
                    <small className="suggestion-type">
                      {suggestion.type === 'title' ? 'Título' : 'Autor'}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Resultados */}
        <div className="search-results">
          {searchTerm && (
            <p className="results-count">
              {filteredBooks.length === 0 
                ? 'No se encontraron resultados' 
                : `${filteredBooks.length} resultado(s) para "${searchTerm}"`
              }
            </p>
          )}
        </div>
        
        {/* Grid de libros */}
        {filteredBooks.length === 0 && searchTerm ? (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h3>No se encontraron libros</h3>
            <p>Intenta con otros términos de búsqueda</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="show-all-button"
            >
              Mostrar todos los libros
            </button>
          </div>
        ) : (
          <div className="books-grid">
            {filteredBooks.map(book => (
              <div key={book.id} className="book-card" onClick={() => handleBookClick(book)}>
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
                      <span>Agotado</span>
                    </div>
                  )}
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.titulo}</h3>
                  <p className="book-author">{book.autor}</p>
                  <div className="book-details">
                    <span className="book-price">${book.precio}</span>
                    <span className="book-stock">
                      <i className="fas fa-box"></i>
                      {book.stock} disponibles
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(book);
                    }}
                    className="add-to-cart-btn"
                    disabled={book.stock <= 0}
                  >
                    <i className="fas fa-cart-plus"></i>
                    {book.stock > 0 ? 'Agregar' : 'Sin stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Inventory;