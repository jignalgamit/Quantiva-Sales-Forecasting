const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const mongoose = require('mongoose');
      if (mongoose.connection.readyState !== 1) {
        // Fallback for Database-Optional mode
        req.user = { 
          _id: '507f1f77bcf86cd799439011', 
          name: 'Demo User', 
          email: 'demo@quantiva.ai',
          isMock: true 
        };
        console.log('Auth bypassing database: Using Mock User');
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
