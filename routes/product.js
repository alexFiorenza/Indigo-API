const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const { verifyToken, verifyAdmin } = require('../utils/auth');

router.get('/:id', productController.getProductPerId);
router.post('/', productController.createProduct);

module.exports = router;
