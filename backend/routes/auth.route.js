const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

// Stricter rate limit on auth endpoints to slow down brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many auth attempts, please try again later' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

module.exports = router;