const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

// MongoDB Configuration
const { connectDB } = require('./config/database_mongo');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const instructionRoutes = require('./routes/instructions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  // Development - Local development servers
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:5173',  // Vite default port
  'https://localhost:5173',
  'http://127.0.0.1:3000',
  'https://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://127.0.0.1:5173',
  'http://192.168.1.2:3000',
  'https://192.168.1.2:3000',
  'http://192.168.1.2:5173',
  'https://192.168.1.2:5173',
  // Production - Netlify URLs
  'https://clinical.netlify.app',
  'https://lustrous-cupcake-b72349.netlify.app',
  'https://clinical-medical-app.netlify.app',
  'https://medicalbarcode.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Development mode - allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Production mode - check specific origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (origin && origin.includes('.netlify.app')) {
      // Allow any .netlify.app subdomain
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware for production
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Set UTF-8 charset for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'MongoDB Atlas',
    service: 'Clinical Medical App Backend'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/instructions', instructionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Medical Application API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login',
      patients: '/api/patients',
      instructions: '/api/instructions'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// HTTPS Server setup
const startServer = () => {
  try {
    // Try to use SSL certificates
    const keyPath = path.join(__dirname, 'cert.key');
    const certPath = path.join(__dirname, 'cert.crt');
    
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      // HTTPS Server
      const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
      
      https.createServer(httpsOptions, app).listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 HTTPS Backend API Server is running on:`);
        console.log(`   Local:   https://localhost:${PORT}`);
        console.log(`   Network: https://192.168.1.2:${PORT}`);
        console.log(`� SSL Certificates loaded successfully`);
      });
    } else {
      throw new Error('SSL certificates not found');
    }
  } catch (error) {
    console.log('⚠️  Could not start HTTPS server:', error.message);
    console.log('⚠️  Starting HTTP server instead...');
    
    // Fallback to HTTP
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 HTTP Backend API Server is running on:`);
      console.log(`   Local:   http://localhost:${PORT}`);
      console.log(`   Network: http://192.168.1.2:${PORT}`);
      console.log(`⚠️  Consider setting up SSL certificates for HTTPS`);
    });
  }
};

// Initialize MongoDB and start server
const initializeApp = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB Connected Successfully');
    
    // Create HTTP server
    const server = http.createServer(app);
    
    // Initialize Socket.IO with CORS
    const io = new Server(server, {
      cors: {
        origin: function (origin, callback) {
          // Allow all origins in development
          if (process.env.NODE_ENV === 'development' || !origin) {
            return callback(null, true);
          }
          // Check allowed origins in production
          if (allowedOrigins.indexOf(origin) !== -1 || (origin && origin.includes('.netlify.app'))) {
            return callback(null, true);
          }
          return callback(new Error('Not allowed by CORS'));
        },
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['polling', 'websocket'],
      allowEIO3: true,
      pingTimeout: 60000,
      pingInterval: 25000
    });

    // Store user sessions: userId -> array of socket IDs
    const userSessions = new Map();

    // Socket.IO connection handling
    io.on('connection', (socket) => {
      console.log('🔌 Client connected:', socket.id);

      // Join user-specific room when authenticated
      socket.on('authenticate', (userId) => {
        console.log(`👤 User ${userId} authenticated on socket ${socket.id}`);
        
        // Join user-specific room
        socket.join(`user:${userId}`);
        
        // Track user sessions
        if (!userSessions.has(userId)) {
          userSessions.set(userId, []);
        }
        userSessions.get(userId).push(socket.id);
        
        console.log(`📱 User ${userId} now has ${userSessions.get(userId).length} device(s) connected`);
      });

      // Handle patient selection in Step 1
      socket.on('patient-selected', ({ userId, patientId, patientName }) => {
        console.log(`🎯 Patient selected by user ${userId}: ${patientName} (${patientId})`);
        
        // Broadcast to all devices of this user
        socket.to(`user:${userId}`).emit('sync-patient-selected', { patientId, patientName });
      });

      // Handle medication scan in Step 2
      socket.on('medication-scanned', ({ userId, patientId, barcode, medicationDescription }) => {
        console.log(`💊 Medication scanned by user ${userId}: ${barcode}`);
        
        // Broadcast to all devices of this user
        socket.to(`user:${userId}`).emit('sync-medication-scanned', { 
          patientId, 
          barcode, 
          medicationDescription 
        });
      });

      // Handle medication completion
      socket.on('medication-completed', ({ userId, patientId, instructionId }) => {
        console.log(`✅ Medication completed by user ${userId}`);
        
        // Broadcast to all devices of this user
        socket.to(`user:${userId}`).emit('sync-medication-completed', { 
          patientId, 
          instructionId 
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
        
        // Remove from user sessions
        userSessions.forEach((sockets, userId) => {
          const index = sockets.indexOf(socket.id);
          if (index > -1) {
            sockets.splice(index, 1);
            console.log(`📱 User ${userId} now has ${sockets.length} device(s) connected`);
            
            // Clean up if no more sockets
            if (sockets.length === 0) {
              userSessions.delete(userId);
            }
          }
        });
      });
    });

    // Make io available to routes
    app.set('io', io);
    
    // Start server
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Backend API Server is running on:`);
      console.log(`   Local:   http://localhost:${PORT}`);
      console.log(`   Network: http://192.168.1.2:${PORT}`);
      console.log(`📱 Ready for network access and QR code scanning`);
      console.log(`🍃 Using MongoDB Atlas Database`);
      console.log(`🔌 Socket.IO enabled for real-time synchronization`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the application
initializeApp();

module.exports = app;
