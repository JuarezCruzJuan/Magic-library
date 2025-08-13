import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import API_CONFIG from '../../config/api';
import '../../Assents/css/GestionBooks.css';

const GestionBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: null,
    categoria_id: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const defaultCategories = [
    { id: 1, nombre: 'Ciencia Ficción' },
    { id: 2, nombre: 'Clásicos' },
    { id: 3, nombre: 'Terror' },
    { id: 4, nombre: 'Suspenso' },
    { id: 5, nombre: 'Fantasía' }
  ];
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchBooks(), fetchCategories()]);
      } catch (error) {
        setError('Error cargando datos. Por favor intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    setCategories(defaultCategories);
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/books`);
      setBooks(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/categories`);
      setCategories(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Por favor seleccione un archivo de imagen válido (JPEG, PNG, GIF)');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({
          ...formData,
          imagen: base64String
        });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const submitData = {
        ...formData,
        // Enviar imagen base64 completa
        imagen: formData.imagen || null
      };
      
      if (editingId) {
        await axios.put(`${API_CONFIG.BASE_URL}/books/${editingId}`, submitData);
      } else {
        await axios.post(`${API_CONFIG.BASE_URL}/books`, submitData);
      }
      
      setFormData({
        titulo: '',
        autor: '',
        descripcion: '',
        precio: '',
        stock: '',
        imagen: null,
        categoria_id: ''
      });
      setImagePreview(null);
      setEditingId(null);
      await fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      setError('Error al guardar el libro. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (book) => {
    const imageUrl = book.imagen ? 
      (book.imagen.startsWith('data:') ? book.imagen : `data:image/jpeg;base64,${book.imagen}`) : 
      null;
    
    setFormData({
      ...book,
      imagen: imageUrl
    });
    setImagePreview(imageUrl);
    setEditingId(book.id);
    document.querySelector('.book-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este libro?')) {
      setIsLoading(true);
      try {
        await axios.delete(`${API_CONFIG.BASE_URL}/books/${id}`);
        await fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        setError('Error al eliminar el libro. Por favor intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="gestion-books-container">
      <div className="gestion-books-header">
        <h1 className="page-title">Gestión de Libros</h1>
        <button 
          className="back-button"
          onClick={() => navigate('/admin-dashboard')}
        >
          Volver al Dashboard
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="gestion-books-content">
        <div className="form-section">
          <h2 className="section-title">{editingId ? 'Editar Libro' : 'Agregar Nuevo Libro'}</h2>
          <form onSubmit={handleSubmit} className="book-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="titulo">Título</label>
                <input
                  id="titulo"
                  type="text"
                  name="titulo"
                  placeholder="Título del libro"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="autor">Autor</label>
                <input
                  id="autor"
                  type="text"
                  name="autor"
                  placeholder="Nombre del autor"
                  value={formData.autor}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Descripción del libro"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="precio">Precio</label>
                <input
                  id="precio"
                  type="number"
                  name="precio"
                  placeholder="Precio"
                  value={formData.precio}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  placeholder="Cantidad disponible"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="imagen">Imagen del Libro</label>
                <input
                  id="imagen"
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview} 
                      alt="Vista previa" 
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, imagen: null });
                      }}
                      className="remove-image-btn"
                    >
                      Eliminar imagen
                    </button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="categoria_id">Categoría</label>
                <select
                  id="categoria_id"
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="primary-button" disabled={isLoading}>
                {isLoading ? 'Procesando...' : (editingId ? 'Actualizar Libro' : 'Agregar Libro')}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="secondary-button" 
                  onClick={() => setEditingId(null)}
                  disabled={isLoading}
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="books-list-section">
          <h2 className="section-title">Lista de Libros</h2>
          {isLoading && <div className="loading-indicator">Cargando...</div>}
          
          {books.length === 0 && !isLoading ? (
            <div className="empty-state">No hay libros disponibles. Agregue un nuevo libro.</div>
          ) : (
            <div className="responsive-table-container">
              <table className="books-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book.id} className="book-row">
                      <td data-label="Imagen">
                        {book.imagen ? (
                          <img 
                            src={book.imagen} 
                            alt={book.titulo}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                          <span>Sin imagen</span>
                        )}
                      </td>
                      <td data-label="Título">{book.titulo}</td>
                      <td data-label="Autor">{book.autor}</td>
                      <td data-label="Precio">${book.precio}</td>
                      <td data-label="Stock">{book.stock}</td>
                      <td data-label="Categoría">{categories.find(c => c.id === book.categoria_id)?.nombre || 'N/A'}</td>
                      <td data-label="Acciones" className="action-buttons">
                        <button 
                          onClick={() => handleEdit(book)} 
                          className="edit-button"
                          disabled={isLoading}
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(book.id)} 
                          className="delete-button"
                          disabled={isLoading}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionBooks;