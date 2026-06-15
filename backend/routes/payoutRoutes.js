const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { createPayoutRequest, getPayoutRequests, updatePayoutStatus } = require('../controllers/payoutController');

router.use(verifyToken);

router.get('/', getPayoutRequests);
router.post('/', authorizeRoles('influencer', 'admin'), createPayoutRequest);
router.patch('/:id/status', authorizeRoles('admin'), updatePayoutStatus);

module.exports = router;
