const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user; // Attach user info to request
    next();
  });
};

// Middleware to check if user is a nurse
const requireNurse = (req, res, next) => {
  if (req.user.role !== 'nurse') {
    return res.status(403).json({ message: 'Access denied. Nurse role required.' });
  }
  next();
};

// Middleware to check if user is authorized to view patient data
const authorizePatientAccess = (req, res, next) => {
  const requestedPatientId = parseInt(req.params.id);
  
  // Nurses can access all patients
  if (req.user.role === 'nurse') {
    return next();
  }
  
  // Patients can only access their own data
  if (req.user.role === 'patient' && req.user.patient_id === requestedPatientId) {
    return next();
  }
  
  return res.status(403).json({ message: 'Access denied. You can only view your own information.' });
};

module.exports = {
  authenticateToken,
  requireNurse,
  authorizePatientAccess
};
