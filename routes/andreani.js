const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../utils/auth');
const andreaniController = require('../controllers/andreani');

router.get('/login', andreaniController.andreaniCredentials);
router.post('/shipping', andreaniController.shippingCost);
router.post('/order', andreaniController.createOrder);
module.exports = router;
