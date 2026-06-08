const express = require('express');
const { createBooking, confirmBooking, cancelBooking, getMyBookings } = require('../controllers/booking.controller.js');
const protect = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createBookingSchema, bookingIdSchema } = require('../validators/schemas');

const router = express.Router();

router.get('/my', protect, getMyBookings);
router.post('/', protect, validate(createBookingSchema), createBooking);
router.post('/confirm', protect, validate(bookingIdSchema), confirmBooking);
router.post('/cancel', protect, validate(bookingIdSchema), cancelBooking);

module.exports = router;