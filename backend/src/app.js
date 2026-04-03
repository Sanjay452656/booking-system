require('dotenv').config();

const express = require('express');
const connectDB = require('./DB/connect');
const authRoutes = require('./routes/auth.routes.js')
const eventRoutes = require('./routes/event.routes.js')
const bookingRoutes = require('./routes/booking.routes.js')
const paymentRoutes = require('./routes/payment.route.js')

const app=express();


connectDB();

app.use(express.json());
app.use('/api/auth',authRoutes)
app.use('/api/events',eventRoutes)
app.use('/api/bookings',bookingRoutes)
app.use('/api/payments',paymentRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`Server is started on port ${process.env.PORT}`);
})

module.exports = app