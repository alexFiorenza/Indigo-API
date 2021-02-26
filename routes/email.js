const express = require('express');
const route = express.Router();
const emailController = require('../controllers/email');
route.get('/test', emailController.testEmail);
route.post('/transaction-accepted', emailController.sendConfirmationOrder);
route.post('/update-order-status', emailController.updateOrderStatus);

module.exports = route;
