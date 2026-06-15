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

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ success: true, message: 'Influencer Affiliate Programme API running' });
});

app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({ success: true, database: 'connected' });
    } catch (error) {
        res.status(500).json({ success: false, database: 'failed', message: error.message });
    }
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
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
});

const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        process.exit(1);
    }
};

startServer();
