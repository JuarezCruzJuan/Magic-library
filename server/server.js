const express = require("express");
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require("cors");
const helmet = require('helmet');
const authRoutes = require("./auth");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://magic-library-fullstack.onrender.com', 'https://magic-library-fullstack-*.onrender.com']
    : ['https://localhost:3000', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Redirect HTTP to HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// Payment routes
app.post('/api/create-payment-intent', async (req, res) => {
  try {
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

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  // Multiple possible paths for the build directory
  const possiblePaths = [
    path.join(__dirname, '../client/build'),
    path.join(process.cwd(), '../client/build'),
    path.join(process.cwd(), 'client/build'),
    '/opt/render/project/src/client/build'
  ];
  
  let staticPath = null;
  
  // Find the first path that exists
  for (const testPath of possiblePaths) {
    console.log('Testing path:', testPath);
    if (require('fs').existsSync(testPath)) {
      staticPath = testPath;
      console.log('Found build directory at:', staticPath);
      break;
    }
  }
  
  if (staticPath) {
    app.use(express.static(staticPath));
    
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      const indexPath = path.join(staticPath, 'index.html');
      console.log('Serving index.html from:', indexPath);
      res.sendFile(indexPath);
    });
  } else {
    console.error('Could not find React build directory in any of the expected locations');
    console.error('Tested paths:', possiblePaths);
    
    // Fallback route when build directory is not found
    app.get('/', (req, res) => {
      res.status(500).json({
        error: 'React build directory not found',
        message: 'The application is not properly configured for production',
        testedPaths: possiblePaths
      });
    });
  }
} else {
  // Development mode - serve a simple message
  app.get('/', (req, res) => {
    res.json({
      message: 'Magic Library API is running in development mode',
      endpoints: {
        api: '/api/*',
        payment: '/api/create-payment-intent',
        confirm: '/api/confirm-payment'
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: err.message 
    });
});

const PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// SSL Configuration
let sslOptions = {};
try {
  sslOptions = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
  };
} catch (error) {
  console.log('SSL certificates not found. Running HTTP only.');
}

// Start servers
if (Object.keys(sslOptions).length > 0) {
  https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${HTTPS_PORT}`);
    console.log('SSL/TLS enabled');
    printRoutes(HTTPS_PORT, 'https');
  });
  
  http.createServer(app).listen(PORT, () => {
    console.log(`HTTP Server running on http://localhost:${PORT}`);
    console.log('(Redirects to HTTPS in production)');
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('SSL not configured - running HTTP only');
    printRoutes(PORT, 'http');
  });
}

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