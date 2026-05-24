const express = require('express');
const { loginUser, registerUser } = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/schemas');

// HOW THIS CHAIN WORKS:
//   validate(registerSchema) runs BEFORE registerUser.
//   If validation fails, it returns a 400 and registerUser never runs.
//   If validation passes, next() is called and registerUser runs normally.

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

module.exports = router;