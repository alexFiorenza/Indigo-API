const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { verifyToken } = require('../utils/auth');

router.get('/getOne/:id', userController.getOneUserPerId);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/update/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);
router.post('/addFavorite', verifyToken, userController.manageFavorites);
router.get('/getFavorites', verifyToken, userController.getFavorites);
router.put('/deleteFavorite', verifyToken, userController.deleteFavorite);
module.exports = router;
