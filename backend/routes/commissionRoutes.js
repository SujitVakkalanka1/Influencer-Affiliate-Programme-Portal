const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const { getCommissionSummary } = require('../controllers/conversionController');

router.use(verifyToken);
router.get('/', getCommissionSummary);
router.get('/:influencerId', getCommissionSummary);

module.exports = router;
