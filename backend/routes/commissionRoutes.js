const express = require('express');
const router = express.Router();

const { getCommissionSummary } = require('../controllers/conversionController');

router.get('/:influencerId', getCommissionSummary);

module.exports = router;