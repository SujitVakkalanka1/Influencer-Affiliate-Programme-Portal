const express = require('express');
const router = express.Router();

console.log('AUTH ROUTES FILE LOADED');

const { register, login } = require('../controllers/authController');

// Test Route
router.get('/test', (req, res) => {
    res.send('Auth Route Working');
});

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

module.exports = router;