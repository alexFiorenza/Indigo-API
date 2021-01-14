const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const { verifyToken, verifyAdmin } = require('../utils/auth');

router.get('/getOne/:id', productController.getProductPerId);
router.get(
  '/homeView',
  [verifyToken, verifyAdmin],
  productController.homeViewProducts
);
router.post('/', [verifyToken, verifyAdmin], productController.createProduct);
router.put('/:id', [verifyToken, verifyAdmin], productController.updateProduct);
router.get('/:page', productController.getAllProducts);
router.delete(
  '/:id',
  [verifyToken, verifyAdmin],
  productController.deleteProduct
);

module.exports = router;
