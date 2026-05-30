const express = require('express');
const router = express.Router();

const {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign
} = require('../controllers/campaignController');

router.post('/', createCampaign);
router.get('/', getAllCampaigns);
router.delete('/:id', deleteCampaign);
router.put('/:id', updateCampaign);
module.exports = router;