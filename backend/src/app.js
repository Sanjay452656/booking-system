require('dotenv').config();

const express = require('express');
const connectDB = require('./DB/connect');

const app=express();

connectDB();

app.listen(process.env.PORT,()=>{
    console.log(`Server is started on port ${process.env.PORT}`);
})

module.exports = app