import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('shopping-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error al cargar carrito desde localStorage:', error);
        setCart([]);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('shopping-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === book.id);
      
      if (existingItem) {
        // Si el libro ya está en el carrito, incrementar cantidad
        return prevCart.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si es un libro nuevo, agregarlo con cantidad 1
        return [...prevCart, {
          id: book.id,
          titulo: book.titulo,
          autor: book.autor,
          precio: book.precio,
          imagen: book.imagen,
          stock: book.stock,
          quantity: 1
        }];
      }
    });
  };

  const removeFromCart = (bookId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== bookId));
  };

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === bookId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const saveOrder = (orderData) => {
    const existingOrders = JSON.parse(localStorage.getItem('user-orders') || '[]');
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      ...orderData
    };
    
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('user-orders', JSON.stringify(updatedOrders));
    return newOrder;
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (bookId) => {
    return cart.some(item => item.id === bookId);
  };

  const getItemQuantity = (bookId) => {
    const item = cart.find(item => item.id === bookId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getItemQuantity,
    saveOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;