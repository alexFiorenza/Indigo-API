const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { verifyToken } = require('../utils/auth');

router.get('/:id', userController.getOneUserPerId);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);
router.put('/addFavorite', verifyToken, userController.manageFavorites);
router.get('/getFavorites', verifyToken, userController.getFavorites);
router.delete('/deleteFavorite', verifyToken, userController.deleteFavorite);
module.exports = router;
