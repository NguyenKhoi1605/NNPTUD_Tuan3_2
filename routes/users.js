var express = require('express');
var router = express.Router();

// Mock user database
const users = [
  { id: 1, username: 'admin', password: 'admin123', email: 'admin@example.com' },
  { id: 2, username: 'user', password: 'user123', email: 'user@example.com' }
];

// Mock tokens storage
const tokens = {};

// Sign in endpoint
router.post('/sign-in', function(req, res, next) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).send({
      message: "Username and password are required"
    });
  }
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).send({
      message: "Invalid username or password"
    });
  }
  
  // Generate simple token (in production use JWT)
  const token = 'token_' + user.id + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  tokens[token] = { userId: user.id, username: user.username, createdAt: new Date() };
  
  res.send({
    message: "Sign in successful",
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).send({
      message: "Token is required"
    });
  }
  
  if (!tokens[token]) {
    return res.status(401).send({
      message: "Invalid or expired token"
    });
  }
  
  req.user = tokens[token];
  next();
};

// Get current user
router.get('/profile', verifyToken, function(req, res, next) {
  const user = users.find(u => u.id === req.user.userId);
  res.send({
    message: "User profile",
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

// Sign out
router.post('/sign-out', verifyToken, function(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  delete tokens[token];
  
  res.send({
    message: "Sign out successful"
  });
});

// List all users (protected)
router.get('/', verifyToken, function(req, res, next) {
  res.send({
    message: "Users list",
    users: users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email
    }))
  });
});

module.exports = router;
