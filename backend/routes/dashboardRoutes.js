const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { getInfluencerDashboard, getAdminDashboard } = require('../controllers/dashboardController');

router.use(verifyToken);

router.get('/influencer', authorizeRoles('influencer', 'brand', 'admin'), getInfluencerDashboard);
router.get('/admin', authorizeRoles('admin'), getAdminDashboard);

module.exports = router;
