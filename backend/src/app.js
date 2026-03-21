require('dotenv').config();

const express = require('express');
const connectDB = require('./DB/connect');
const authRoutes = require('./routes/auth.routes.js')

const app=express();

connectDB();

app.use('/api/auth',authRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`Server is started on port ${process.env.PORT}`);
})

module.exports = app