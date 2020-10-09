const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { verifyToken } = require('../utils/auth');

router.get('/:id', userController.getOneUserPerId);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
