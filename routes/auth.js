// routes/auth.js or a similar route file
const express = require('express');
const router = express.Router();
const { forgotPassword } = require('../controllers/authController');

// Define the forgot password route
router.post('/forgot-password', forgotPassword);

module.exports = router;
