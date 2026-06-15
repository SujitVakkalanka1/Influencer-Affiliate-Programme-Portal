const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const {
    createAffiliateLink,
    getAllAffiliateLinks,
    getAffiliateLinkById,
    deleteAffiliateLink
} = require('../controllers/affiliateLinkController');

router.use(verifyToken);

router.post('/', createAffiliateLink);
router.get('/', getAllAffiliateLinks);
router.get('/:id', getAffiliateLinkById);
router.delete('/:id', deleteAffiliateLink);

module.exports = router;
