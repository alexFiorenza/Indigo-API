const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../utils/auth');
const orderController = require('../controllers/orders');

router.post('/proccess_payment', verifyToken, orderController.processPayment);
router.put(
  '/update/:id',
  [verifyToken, verifyAdmin],
  orderController.updateOrder
);
router.get('/', verifyToken, orderController.getAllOrders);
router.get('/order/:id', verifyToken, orderController.getOrderId);
router.get('/userOrder/:id', verifyToken, orderController.getOrderPerUser);
module.exports = router;
