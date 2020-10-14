const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/auth');
const orderController = require('../controllers/orders');

router.post('/proccess_payment', verifyToken, orderController.processPayment);

module.exports = router;
