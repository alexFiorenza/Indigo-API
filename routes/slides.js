const express = require('express');
const router = express.Router();
const controller = require('../controllers/slides');
const { verifyToken, verifyAdmin } = require('../utils/auth');

router.get('/:id', controller.getSliderPerId);
router.get('/', controller.getAllSlides);
router.post('/', [verifyToken, verifyAdmin], controller.createSlide);
router.put('/:id', [verifyToken, verifyAdmin], controller.updateSlide);

module.exports = router;
