const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign
} = require('../controllers/campaignController');

router.use(verifyToken);

router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.post('/', authorizeRoles('admin', 'brand'), createCampaign);
router.put('/:id', authorizeRoles('admin', 'brand'), updateCampaign);
router.delete('/:id', authorizeRoles('admin'), deleteCampaign);

module.exports = router;
