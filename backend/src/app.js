require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./DB/connect');
const authRoutes = require('./routes/auth.routes.js');
const eventRoutes = require('./routes/event.routes.js');
const bookingRoutes = require('./routes/booking.routes.js');
const paymentRoutes = require('./routes/payment.route.js');

const app = express();

// ─── DATABASE ────────────────────────────────────────────────────────────────
connectDB();

// ─── CORS ────────────────────────────────────────────────────────────────────
// CORS (Cross-Origin Resource Sharing) controls which domains can call your API.
// Without this, browsers BLOCK all requests from a different origin (e.g., your
// React frontend at localhost:3000 calling your API at localhost:5000).
//
// origin: process.env.CLIENT_URL  → only allow your specific frontend URL
//   In development you'd set CLIENT_URL=http://localhost:3000 in .env
//   In production you'd set it to your deployed frontend domain.
//
// credentials: true → allow cookies and Authorization headers to be sent
//   (required when using JWT in the Authorization header)
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
}));

// ─── RATE LIMITING ───────────────────────────────────────────────────────────
// Rate limiting restricts how many requests a single IP can make in a time window.
// This defends against:
//   - Brute-force attacks (trying thousands of passwords on /login)
//   - DoS attacks (flooding the server with requests)
//
// windowMs: 15 * 60 * 1000 → 15-minute window
// limit: 20 → max 20 requests per IP in that window
// standardHeaders: true → sends `RateLimit-*` headers so the client knows their limit
// legacyHeaders: false → disables old `X-RateLimit-*` headers
//
// We apply this ONLY on /api/auth because that is the brute-force target.
// General API routes don't need such tight limits.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: { message: "Too many requests from this IP, please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

// ─── BODY PARSER ─────────────────────────────────────────────────────────────
app.use(express.json());

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);   // rate limiter on auth only
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────
// Express has a special 4-argument middleware signature: (err, req, res, next).
// When any middleware or controller calls next(error) OR throws an unhandled error,
// Express skips all normal middleware and jumps directly to this handler.
//
// Without this, unhandled errors cause Express to send an ugly HTML error page
// or crash the process entirely.
//
// This MUST be the LAST app.use() call — Express identifies it as an error
// handler specifically because it has 4 parameters.
//
// We log the stack trace to the server console (for debugging) while sending
// a clean JSON response to the client (no internal details leaked).
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.stack}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({ message });
});

// ─── SERVER ──────────────────────────────────────────────────────────────────
app.listen(process.env.PORT, () => {
    console.log(`Server is started on port ${process.env.PORT}`);
});

module.exports = app;