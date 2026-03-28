const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    event:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },
    quantity:{
        type:Number,
        required:true,
        min:1,
    },
    status:{
        type:String,
        enum:["PENDING","CONFIRMED"],
        default:"PENDING"
    }
},{timestamps:true})

const Booking = mongoose.model("Booking",bookingSchema);

module.exports = Booking;

