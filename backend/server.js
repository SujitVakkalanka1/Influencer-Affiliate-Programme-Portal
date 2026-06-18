require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const { initializeDatabase } = require('./config/initDatabase');

const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const affiliateLinkRoutes = require('./routes/affiliateLinkRoutes');
const conversionRoutes = require('./routes/conversionRoutes');
const commissionRoutes = require('./routes/commissionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const payoutRoutes = require('./routes/payoutRoutes');
const { trackAffiliateClickByCode } = require('./controllers/affiliateLinkController');

const app = express();
const PORT = Number(process.env.PORT || 5000);
const allowedOrigins = new Set([
    'http://localhost:5173',
    'https://influencer-affiliate-programme-port.vercel.app',
    ...String(process.env.CLIENT_URL || '')
        .split(',')
        .map((origin) => origin.trim().replace(/\/$/, ''))
        .filter(Boolean)
]);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin.replace(/\/$/, ''))) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running');
});

app.get('/api/health', (req, res) => {
    res.json({ message: 'API working' });
});

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/affiliate-links', affiliateLinkRoutes);
app.use('/api/conversions', conversionRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payouts', payoutRoutes);
app.get('/ref/:unique_code', trackAffiliateClickByCode);

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((error, req, res, next) => {
    console.error('Unhandled request error:', error.message);
    const isCorsError = error.message.startsWith('CORS blocked request');
    res.status(isCorsError ? 403 : 500).json({
        success: false,
        message: isCorsError ? error.message : 'Server error'
    });
});

const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Backend startup failed:', error.message);
        process.exit(1);
    }
};

startServer();
