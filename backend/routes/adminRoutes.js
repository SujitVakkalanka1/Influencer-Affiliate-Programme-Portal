const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const {
    getAllUsers,
    getAllCampaigns,
    getAllAffiliateLinks,
    getAllConversions
} = require('../controllers/adminController');

router.use(verifyToken);
router.use(authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.get('/campaigns', getAllCampaigns);
router.get('/affiliate-links', getAllAffiliateLinks);
router.get('/conversions', getAllConversions);

module.exports = router;