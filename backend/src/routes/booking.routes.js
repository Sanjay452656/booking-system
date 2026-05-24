const express = require('express');
const { createBooking, confirmBooking, cancelBooking } = require('../controllers/booking.controller.js');
const protect = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createBookingSchema, bookingIdSchema } = require('../validators/schemas');

const router = express.Router();

// Middleware order: protect → validate → controller
// protect runs first (checks JWT), then validate checks the body shape,
// then the controller runs only if both pass.

router.post('/', protect, validate(createBookingSchema), createBooking);
router.post('/confirm', protect, validate(bookingIdSchema), confirmBooking);
router.post('/cancel', protect, validate(bookingIdSchema), cancelBooking);

module.exports = router;