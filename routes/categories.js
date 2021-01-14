const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../utils/auth');
const categoryController = require('../controllers/categories');

router.get('', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('', [verifyToken, verifyAdmin], categoryController.createCategory);
router.delete('/:id', categoryController.deleteCategory);
router.put(
  '/product/:id',
  [verifyToken, verifyAdmin],
  categoryController.addCategoryToProduct
);
router.delete('/product/:id', categoryController.deleteCategoryFromProduct);
router.put(
  '/subcategory/:id',
  [verifyToken, verifyAdmin],
  categoryController.updateSubCategories
);
router.put('/subcategory/delete/:id', categoryController.deleteSubCategory);
//TODO Check if categories and subcategories would be deleted from all products
module.exports = router;
