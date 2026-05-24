const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/payment.controller.js');
const protect = require('../middleware/auth.middleware.js');
const validate = require('../middleware/validate.middleware');
const { createOrderSchema, verifyPaymentSchema } = require('../validators/schemas');

const router = express.Router();

router.post('/create-order', protect, validate(createOrderSchema), createOrder);
router.post('/verify', protect, validate(verifyPaymentSchema), verifyPayment);

module.exports = router;