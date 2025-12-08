const express = require("express");
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require("cors");
const helmet = require('helmet');
const authRoutes = require("./auth");
// Importar script de inicialización de DB
const { initDB } = require('./init-db'); 

// Inicializar Stripe solo si existe la clave
let stripe = null;
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (stripeKey) {
  try {
    stripe = require('stripe')(stripeKey);
  } catch (e) {
    console.error('Stripe no pudo inicializarse:', e.message);
  }
} else {
  console.warn('STRIPE_SECRET_KEY no está configurada. Rutas de pago deshabilitadas.');
}
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Middleware para desarrollo local
// CORS: en producción permitimos cualquier origen (necesario si el cliente
// se sirve desde el mismo dominio o un dominio distinto). En desarrollo,
// limitamos a localhost:3000.
const isProd = process.env.NODE_ENV === 'production';
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL // opcional: dominio del front si se usa distinto dominio
].filter(Boolean);

const corsOptions = isProd
  ? {
      origin: function (origin, callback) {
        // Permitir cualquier origen en producción, devolviendo el mismo origen
        // para compatibilidad con credentials.
        callback(null, origin || '*');
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  : {
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, origin || '*');
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configuración general
// En producción servimos el build de React como estático

// Payment routes
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: 'Stripe no configurado. Pagos deshabilitados en este entorno.'
      });
    }
    const { amount, currency = 'mxn', metadata = {} } = req.body;

    // Crear el payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe maneja centavos
      currency: currency,
      metadata: metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la intención de pago',
      error: error.message
    });
  }
});

// Confirmar pago
app.post('/api/confirm-payment', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: 'Stripe no configurado. Pagos deshabilitados en este entorno.'
      });
    }
    const { paymentIntentId, orderData } = req.body;

    // Verificar el estado del pago
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Aquí puedes guardar la orden en tu base de datos
      // Por ejemplo: await saveOrder(orderData, paymentIntent);
      
      res.json({
        success: true,
        message: 'Pago procesado exitosamente',
        paymentIntent: paymentIntent
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'El pago no fue exitoso',
        status: paymentIntent.status
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error al confirmar el pago',
      error: error.message
    });
  }
});

// Routes
app.use('/api', authRoutes);

// Healthcheck sencillo para Render (debe ir ANTES del fallback SPA)
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, env: isProd ? 'production' : 'development' });
});

// Servir estáticos del cliente en producción
if (isProd) {
  const clientBuildPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));

  // Fallback para rutas del cliente (SPA)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// API Status endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Magic Library API está funcionando correctamente',
    status: 'activo',
    environment: isProd ? 'production' : 'development',
    endpoints: {
      auth: ['/api/login', '/api/register'],
      books: ['/api/books'],
      users: ['/api/users'],
      payments: ['/api/create-payment-intent', '/api/confirm-payment']
    }
  });
});



// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: err.message 
    });
});

// Start server
const PORT = process.env.PORT || 4000;

// Función para iniciar el servidor después de intentar conectar a la DB
const startServer = async () => {
  try {
    // Intentar inicializar la DB al arrancar (crear tablas si no existen)
    console.log('Verificando estado de la base de datos...');
    try {
      await initDB();
      console.log('Verificación de base de datos completada.');
    } catch (dbError) {
      console.error('Advertencia: Error al inicializar la base de datos, pero el servidor continuará:', dbError.message);
    }

    if (process.env.NODE_ENV === 'production') {
      // En producción, Render maneja SSL, usamos HTTP simple en el puerto asignado
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (Production Mode)`);
        console.log(`Health check available at http://localhost:${PORT}/health`);
      });
    } else {
      // En desarrollo local
      try {
        const keyPath = path.join(__dirname, '../ssl/server.key');
        const certPath = path.join(__dirname, '../ssl/server.crt');
        
        if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
          const httpsOptions = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
          };
          https.createServer(httpsOptions, app).listen(PORT, () => {
            console.log(`Secure Server running on port ${PORT} (Development Mode)`);
            console.log(`API available at https://localhost:${PORT}`);
          });
        } else {
          app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} (Development Mode - No SSL)`);
            console.log(`API available at http://localhost:${PORT}`);
          });
        }
      } catch (e) {
        console.error('Error starting server:', e);
        app.listen(PORT, () => {
          console.log(`Fallback: Server running on port ${PORT}`);
        });
      }
    }
  } catch (error) {
    console.error('Error fatal al iniciar el servidor:', error);
  }
};

startServer();

function printRoutes(port, protocol) {
  console.log('Routes available:');
  console.log(`- POST ${protocol}://localhost:${port}/api/login`);
  console.log(`- POST ${protocol}://localhost:${port}/api/admin/register`);
  console.log(`- POST ${protocol}://localhost:${port}/api/register`);
  console.log(`- POST ${protocol}://localhost:${port}/api/recover-password`);
  console.log(`- POST ${protocol}://localhost:${port}/api/reset-password`);
  console.log(`- GET ${protocol}://localhost:${port}/api/categories`);
  console.log(`- GET ${protocol}://localhost:${port}/api/books`);
  console.log(`- POST ${protocol}://localhost:${port}/api/books`);
  console.log(`- PUT ${protocol}://localhost:${port}/api/books/:id`);
  console.log(`- DELETE ${protocol}://localhost:${port}/api/books/:id`);
  console.log(`- GET ${protocol}://localhost:${port}/api/users`);
  console.log(`- GET ${protocol}://localhost:${port}/api/users/:id`);
  console.log(`- PUT ${protocol}://localhost:${port}/api/users/:id`);
  console.log(`- DELETE ${protocol}://localhost:${port}/api/users/:id`);
  console.log(`- POST ${protocol}://localhost:${port}/api/create-payment-intent`);
  console.log(`- POST ${protocol}://localhost:${port}/api/confirm-payment`);
}
