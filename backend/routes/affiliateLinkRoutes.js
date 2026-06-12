const express = require('express');
const router = express.Router();

const {
    createAffiliateLink,
    getAllAffiliateLinks,
    getAffiliateLinkById,
    deleteAffiliateLink
} = require('../controllers/affiliateLinkController');

router.post('/', createAffiliateLink);
router.get('/', getAllAffiliateLinks);
router.get('/:id', getAffiliateLinkById);
router.delete('/:id', deleteAffiliateLink);

module.exports = router;