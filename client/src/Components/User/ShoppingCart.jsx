import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Nav from './Nav';
import Footer from './Footer';
import axios from 'axios';

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

      if (!data.success) {
        throw new Error(data.message);
      }

      // Confirmar el pago
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            address: {
              line1: customerInfo.address
            }
          },
        }
      });

      if (result.error) {
        setPaymentError(result.error.message);
      } else {
        // Pago exitoso
        await axios.post('http://localhost:3001/api/confirm-payment', {
          paymentIntentId: result.paymentIntent.id,
          orderData: {
            cart,
            total,
            customerInfo
          }
        });
        
        onPaymentSuccess(result.paymentIntent);
      }
    } catch (error) {
      setPaymentError(error.message);
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
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="row">
        <div className="col-md-6">
          <h5>Información del cliente</h5>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              className="form-control"
              value={customerInfo.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control"
              value={customerInfo.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              className="form-control"
              value={customerInfo.address}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <h5>Información de pago</h5>
          <div className="card p-3">
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
                },
              }}
            />
          </div>
        </div>
      </div>
      
      {paymentError && (
        <div className="alert alert-danger mt-3">
          {paymentError}
        </div>
      )}
      
      <div className="text-center mt-4">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="btn btn-primary btn-lg"
        >
          {isProcessing ? 'Procesando...' : `Pagar $${total}`}
        </button>
      </div>
    </form>
  );
};

const ShoppingCart = () => {
  const [cart, setCart] = useState([
    // Datos de ejemplo - reemplaza con tu lógica real
    {
      id: 1,
      titulo: 'Libro de ejemplo',
      precio: 299.99,
      quantity: 1
    }
  ]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handlePaymentSuccess = (paymentIntent) => {
    setPaymentSuccess(true);
    setCart([]); // Limpiar carrito
    setShowCheckout(false);
  };

  if (paymentSuccess) {
    return (
      <>
        <Nav />
        <div className="container mt-5">
          <div className="alert alert-success text-center">
            <h2>¡Pago exitoso!</h2>
            <p>Tu pedido ha sido procesado correctamente.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setPaymentSuccess(false)}
            >
              Continuar comprando
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="container mt-5">
        <h2>Carrito de Compras</h2>
        {cart.length === 0 ? (
          <div className="alert alert-info">
            Tu carrito está vacío
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Libro</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.titulo}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>${item.precio}</td>
                      <td>${(item.precio * item.quantity).toFixed(2)}</td>
                      <td>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-end">
              <h4>Total: ${calculateTotal().toFixed(2)}</h4>
              {!showCheckout ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCheckout(true)}
                >
                  Proceder al pago
                </button>
              ) : (
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowCheckout(false)}
                >
                  Cancelar pago
                </button>
              )}
            </div>
            
            {showCheckout && (
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  cart={cart}
                  total={calculateTotal()}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </Elements>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ShoppingCart;