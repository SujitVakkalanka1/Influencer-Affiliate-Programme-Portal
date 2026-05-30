require('dotenv').config();
const db = require('./config/db');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const verifyToken = require('./middleware/authMiddleware');
const authorizeRoles = require('./middleware/roleMiddleware');
const campaignRoutes = require('./routes/campaignRoutes');
const app = express();

app.use(cors());
app.use(express.json());

// Authentication Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.get('/profile', verifyToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});
// Admin Route
app.get(
    '/admin-dashboard',
    verifyToken,
    authorizeRoles('admin'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Welcome Admin'
        });
    }
);

// Brand Route
app.get(
    '/brand-dashboard',
    verifyToken,
    authorizeRoles('brand'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Welcome Brand'
        });
    }
);

// Influencer Route
app.get(
    '/influencer-dashboard',
    verifyToken,
    authorizeRoles('influencer'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Welcome Influencer'
        });
    }
);

app.get('/direct-test', (req, res) => {
    res.send('Direct Route Working');
});

app.get('/check', (req, res) => {
    res.send('CHECK ROUTE UPDATED 123');
});

// Home Route
app.get('/', (req, res) => {
    res.send('Backend Running Successfully');
});

// Database Test Route
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SHOW DATABASES');

        res.json({
            success: true,
            databases: rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});