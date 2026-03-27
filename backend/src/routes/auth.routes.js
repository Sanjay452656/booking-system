const express = require('express');
const { loginUser, registerUser } = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');

const router=express.Router();

router.post('/login',protect,loginUser);
router.post('/register',registerUser);

module.exports = router;