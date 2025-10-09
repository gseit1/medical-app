const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

// Login controller
const login = async (req, res) => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Request body:', req.body);
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      console.log('❌ Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    console.log('✓ Searching for user:', username);
    // Find user in database
    const user = await User.findOne({ username });

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('✓ User found:', { id: user.id, username: user.username, role: user.role });

    // Compare passwords
    console.log('Comparing passwords...');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✓ Password valid');

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        patient_id: user.patient_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✓ Token generated');
    console.log('✅ Login successful for user:', username);

    // Return user info and token
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        patient_id: user.patient_id
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Register new user (optional - for admin use)
const register = async (req, res) => {
  try {
    const { username, password, role, patient_id } = req.body;

    // Validate input
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      patient_id: patient_id || null
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      userId: savedUser._id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

module.exports = {
  login,
  register
};
