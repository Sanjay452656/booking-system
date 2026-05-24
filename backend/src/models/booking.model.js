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
        enum:["PENDING","CONFIRMED","CANCELLED"],
        default:"PENDING"
    },
    expiresAt:{
        type:Date,
        // TTL INDEX EXPLAINED:
        // A TTL (Time-To-Live) index is a special MongoDB index that automatically
        // DELETES documents after a certain amount of time has passed.
        //
        // expireAfterSeconds: 0 means:
        //   "Delete this document exactly at the datetime stored in the expiresAt field."
        //   (if it were 300, MongoDB would delete it 300 seconds AFTER expiresAt)
        //
        // HOW IT WORKS:
        //   1. We store expiresAt = now + 5 minutes when creating a booking.
        //   2. MongoDB's background cleanup task runs every ~60 seconds.
        //   3. Any document whose `expiresAt` has passed gets automatically deleted.
        //
        // IMPORTANT CAVEAT:
        //   This deletes the entire booking document but does NOT roll back seats.
        //   For production, you'd use a separate cron job that:
        //     - Finds PENDING bookings where expiresAt < now
        //     - Increments availableSeats back on the event
        //     - Then marks the booking CANCELLED (or deletes it)
        //
        //   The TTL index here handles auto-cleanup of expired PENDING bookings
        //   that were never paid for (garbage collection).
        index: { expireAfterSeconds: 0 }
    }
},{timestamps:true})

const Booking = mongoose.model("Booking",bookingSchema);

module.exports = Booking;
