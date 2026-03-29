const express = require('express');
const { createBooking, confirmBooking } = require('../controllers/booking.controller.js');
const protect = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/',protect,createBooking)
router.post('/confirm',protect,confirmBooking)

module.exports = router;