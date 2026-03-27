const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String
    },
    date:{
        type:Date,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    totalSeats:{
        type:Number,
        required:true,
        min:1
    },
    availableSeats:{
        type:Number,
        required:true
    },
    organiser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

const Event = mongoose.model("Event",eventSchema);

module.exports = Event;