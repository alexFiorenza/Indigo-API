const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../utils/auth');
const analyticsController = require('../controllers/analytics');
router.get('/general-data/:date', analyticsController.getGeneralDataView);

module.exports = router;
