const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const { verifyToken, verifyAdmin } = require('../utils/auth');

router.get('/:id', productController.getProductPerId);
router.post('/', verifyToken, verifyAdmin, productController.createProduct);
router.put('/:id', verifyToken, verifyAdmin, productController.updateProduct);
router.delete(
  '/:id',
  verifyToken,
  verifyAdmin,
  productController.deleteProduct
);

module.exports = router;
