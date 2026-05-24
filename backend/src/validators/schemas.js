const Joi = require('joi');

// AUTH SCHEMAS
// Joi.object() defines the expected shape of req.body.
// Each key gets a chain of rules:
//   .string()   → must be a string
//   .email()    → must be a valid email format
//   .min(6)     → minimum 6 characters
//   .required() → field must be present and not empty

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required()
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'any.required': 'Name is required'
        }),

    email: Joi.string().email().lowercase().required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string().min(6).required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        }),

    // role is optional — defaults to "USER" in the model.
    // Joi.valid() restricts allowed values, like an enum.
    role: Joi.string().valid('USER', 'ORGANIZER').optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required()
        .messages({ 'any.required': 'Email is required' }),

    password: Joi.string().required()
        .messages({ 'any.required': 'Password is required' })
});

// BOOKING SCHEMAS

const createBookingSchema = Joi.object({
    // .string().hex().length(24) validates MongoDB ObjectId format
    eventId: Joi.string().hex().length(24).required()
        .messages({ 'any.required': 'eventId is required', 'string.length': 'eventId must be a valid MongoDB ObjectId' }),

    // quantity must be a whole number (integer) of at least 1
    quantity: Joi.number().integer().min(1).required()
        .messages({
            'number.min': 'Quantity must be at least 1',
            'any.required': 'Quantity is required'
        })
});

const bookingIdSchema = Joi.object({
    bookingId: Joi.string().hex().length(24).required()
        .messages({ 'any.required': 'bookingId is required' })
});

// EVENT SCHEMA

const createEventSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional(),

    // Joi.date() automatically parses ISO strings, timestamps, etc.
    date: Joi.date().greater('now').required()
        .messages({ 'date.greater': 'Event date must be in the future' }),

    price: Joi.number().min(0).required()
        .messages({ 'number.min': 'Price cannot be negative' }),

    totalSeats: Joi.number().integer().min(1).required()
        .messages({ 'number.min': 'Must have at least 1 seat' })
});

// PAYMENT SCHEMAS

const createOrderSchema = Joi.object({
    bookingId: Joi.string().hex().length(24).required()
});

const verifyPaymentSchema = Joi.object({
    razorpay_order_id: Joi.string().required(),
    razorpay_payment_id: Joi.string().required(),
    razorpay_signature: Joi.string().required(),
    bookingId: Joi.string().hex().length(24).required()
});

module.exports = {
    registerSchema,
    loginSchema,
    createBookingSchema,
    bookingIdSchema,
    createEventSchema,
    createOrderSchema,
    verifyPaymentSchema
};
