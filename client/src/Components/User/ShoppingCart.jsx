import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useCart } from '../../contexts/CartContext';
import Nav from './Nav';
import Footer from './Footer';
import axios from 'axios';
import './ShoppingCart.css';

// Inicializar Stripe con tu clave pública
const stripePromise = loadStripe('pk_test_tu_clave_publica_de_stripe');

const CheckoutForm = ({ cart, total, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Crear payment intent en el servidor
      const { data } = await axios.post('http://localhost:3001/api/create-payment-intent', {
        amount: total,
        currency: 'mxn',
        metadata: {
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          items_count: cart.length
        }
      });

      const cardElement = elements.getElement(CardElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
              address: {
                line1: customerInfo.address
              }
            }
          }
        }
      );

      if (error) {
        setPaymentError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess({
          id: paymentIntent.id,
          total: total,
          items: cart
        });
      }
    } catch (error) {
      setPaymentError('Error al procesar el pago. Inténtalo de nuevo.');
    }

    setIsProcessing(false);
  };

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form-content">
      <h3><i className="fas fa-credit-card me-2"></i>Información de pago</h3>
      
      <div className="customer-info">
        <h4><i className="fas fa-user me-2"></i>Información del cliente</h4>
        <div className="form-group">
          <label htmlFor="name">Nombre completo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={customerInfo.name}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Dirección</label>
          <input
            type="text"
            id="address"
            name="address"
            value={customerInfo.address}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
      </div>

      <div className="payment-info">
        <h4><i className="fas fa-credit-card me-2"></i>Información de la tarjeta</h4>
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {paymentError && (
        <div className="payment-error">
          <i className="fas fa-exclamation-triangle"></i>
          {paymentError}
        </div>
      )}

      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="pay-btn"
      >
        {isProcessing ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Procesando...
          </>
        ) : (
          <>
            <i className="fas fa-lock"></i>
            Pagar ${total.toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
};

const ShoppingCart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  const handlePaymentSuccess = (orderData) => {
    setLastOrder(orderData);
    setPaymentSuccess(true);
    clearCart();
    setShowCheckout(false);
  };

  if (paymentSuccess) {
    return (
      <>
        <Nav />
        <div className="shopping-cart-container">
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <div className="success-content">
              <h2>¡Pago exitoso!</h2>
              <p>Tu pedido ha sido procesado correctamente. ¡Gracias por tu compra!</p>
              {lastOrder && (
                <div className="order-details">
                  <h4><i className="fas fa-receipt me-2"></i>Detalles del pedido</h4>
                  <p><strong>ID del pedido:</strong> {lastOrder.id}</p>
                  <p><strong>Total:</strong> ${lastOrder.total.toFixed(2)}</p>
                  <p><strong>Artículos:</strong> {lastOrder.items.length} libro(s)</p>
                </div>
              )}
              <div className="success-actions">
                <button 
                  className="continue-shopping-btn"
                  onClick={() => window.location.href = '/inventory'}
                >
                  <i className="fas fa-shopping-cart"></i> Continuar comprando
                </button>
                <button 
                  className="checkout-btn"
                  onClick={() => window.location.href = '/profile'}
                >
                  <i className="fas fa-user"></i> Ver mis órdenes
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
      <div className="shopping-cart-container">
        <div className="cart-header">
          <h1 className="cart-title">
            <i className="fas fa-shopping-cart"></i>
            Carrito de Compras
          </h1>
        </div>
        
        <div className="container">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <h3>Tu carrito está vacío</h3>
              <p>¡Descubre nuestra increíble colección de libros y encuentra tu próxima lectura favorita!</p>
              <a href="/inventory" className="continue-shopping-btn">
                <i className="fas fa-book"></i>
                Explorar libros
              </a>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-table-container">
                <div className="table-responsive">
                  <table className="cart-table">
                    <thead>
                      <tr>
                        <th><i className="fas fa-book me-2"></i>Libro</th>
                        <th><i className="fas fa-sort-numeric-up me-2"></i>Cantidad</th>
                        <th><i className="fas fa-dollar-sign me-2"></i>Precio</th>
                        <th><i className="fas fa-calculator me-2"></i>Total</th>
                        <th><i className="fas fa-cogs me-2"></i>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="cart-item-info">
                              <div className="cart-item-image">
                                {item.imagen ? (
                                  <img 
                                    src={item.imagen} 
                                    alt={item.titulo}
                                    className="cart-book-image"
                                  />
                                ) : (
                                  <div className="no-image">
                                    <i className="fas fa-book"></i>
                                  </div>
                                )}
                              </div>
                              <div className="cart-item-details">
                                <strong>{item.titulo}</strong>
                                {item.autor && <div className="text-muted small">por {item.autor}</div>}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="quantity-controls">
                              <button 
                                className="quantity-btn"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                              <span className="quantity-display">{item.quantity}</span>
                              <button 
                                className="quantity-btn"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                          </td>
                          <td><strong>${item.precio}</strong></td>
                          <td><strong>${(item.precio * item.quantity).toFixed(2)}</strong></td>
                          <td>
                            <button 
                              className="remove-btn"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <i className="fas fa-trash"></i>
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="cart-total">
                <h3><i className="fas fa-receipt me-2"></i>Resumen del pedido</h3>
                <div className="total-amount">${getCartTotal().toFixed(2)}</div>
                <div className="cart-actions">
                  <button 
                    className="clear-cart-btn"
                    onClick={clearCart}
                  >
                    <i className="fas fa-trash-alt"></i>
                    Vaciar carrito
                  </button>
                  <button 
                    className="checkout-btn"
                    onClick={() => setShowCheckout(!showCheckout)}
                  >
                    <i className="fas fa-credit-card"></i>
                    {showCheckout ? 'Ocultar checkout' : 'Proceder al pago'}
                  </button>
                </div>
              </div>

              {showCheckout && (
                <div className="checkout-form">
                  <Elements stripe={stripePromise}>
                    <CheckoutForm 
                      cart={cart}
                      total={getCartTotal()}
                      onPaymentSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShoppingCart;