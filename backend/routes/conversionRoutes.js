const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const {
    createConversion,
    getAllConversions,
    getConversionById,
    deleteConversion
} = require('../controllers/conversionController');

router.use(verifyToken);

router.post('/', createConversion);
router.get('/', getAllConversions);
router.get('/:id', getConversionById);
router.delete('/:id', deleteConversion);

module.exports = router;
