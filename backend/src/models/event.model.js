const mongoose = require('mongoose')

const CATEGORIES = ['Music', 'Technology', 'Sports', 'Arts', 'Food & Drink', 'Business', 'Education', 'Health', 'Other'];

const eventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
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
    category:{
        type:String,
        enum: CATEGORIES,
        default: 'Other'
    },
    location:{
        type:String,
        trim:true,
        default: ''
    },
    organiser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    image:{
        type:String,
        trim:true,
        default: ''
    }
},{timestamps:true})

const Event = mongoose.model("Event",eventSchema);

module.exports = Event;