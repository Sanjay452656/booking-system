const Booking = require("../models/booking.model");
const Event = require("../models/event.model");

async function createBooking(req,res){

    try {
        
        const { eventId , quantity} = req.body;

        if(!eventId || !quantity){
            return res.status(400).json({
                message:"Missing Fields"
            })
        }

        // findOneAndUpdate(filter,Updates,options)
        const event = await Event.findOneAndUpdate(
        {
            _id : eventId,
            availableSeats: { $gte: quantity},
        },
        {
            $inc : {availableSeats: -quantity},
        },
        {new : true}
        );

        if(!event){
            return res.status(400).json({
                message: "Not enought seats available"
            })
        }

        let booking;

        try {
            booking  = await Booking.create({
                user: req.user.id,
                event: eventId,
                quantity,
                status: "PENDING",
                expiresAt: new Date(Date.now() + 5*60*1000) // 5 minutes from now
            });
        } catch (error) {
            //  ROLLBACK seats if booking fails
            await Event.findByIdAndUpdate(eventId,{
                $inc : {availableSeats: quantity},
            })
            throw new Error("Booking creation failed");
        }


        res.status(201).json({
            message:"Booking Created",
            booking,
        })

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

async function confirmBooking(req,res){
    try {
        const {bookingId} = req.body;

        const booking = await Booking.findById(bookingId);

        if(!booking){
            return res.status(404).json({
                message:"Booking not found"
            })
        }

        // OWNERSHIP CHECK
        // booking.user is a MongoDB ObjectId. We use .toString() to convert it
        // to a plain string so we can compare it with req.user.id (a string from the JWT).
        // Without .toString(), ObjectId !== string even if they represent the same value.
        if(booking.user.toString() !== req.user.id){
            return res.status(403).json({
                message:"Forbidden: You can only manage your own bookings"
            })
        }

        if(booking.status !== "PENDING"){
            return res.status(400).json({
                message:"Invalid state"
            })
        }

        booking.status= "CONFIRMED";
        await booking.save();

        res.json({
            message: "Booking Confirmed",
            booking
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

async function cancelBooking(req,res){
    try {
        const {bookingId} = req.body;

        const booking = await Booking.findById(bookingId);

        if(!booking){
            return res.status(404).json({message:"Booking not found"})
        }

        // OWNERSHIP CHECK — same reasoning as in confirmBooking above
        if(booking.user.toString() !== req.user.id){
            return res.status(403).json({
                message:"Forbidden: You can only manage your own bookings"
            })
        }

        if(booking.status !== "PENDING"){
            return res.status(400).json({message:"Invalid state"})
        }

        booking.status = "CANCELLED";
        await booking.save();

        // ROLLBACK seats
        await Event.findByIdAndUpdate(booking.event,{
            $inc : {availableSeats: booking.quantity}
        })

        res.json({message:"Booking Cancelled",booking})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports = {createBooking , confirmBooking,cancelBooking};