const express = require('express');
const { createBooking, confirmBooking, cancelBooking } = require('../controllers/booking.controller.js');
const protect = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/',protect,createBooking)
router.post('/confirm',protect,confirmBooking)
router.post("/cancel", protect, cancelBooking);

module.exports = router;