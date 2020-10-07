const express = require('express');
const router = express.Router();
const { getOneUserPerId, registerUser } = require('../controllers/user');

router.get('/:id', getOneUserPerId);
router.post('/login', registerUser);

module.exports = router;
