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

        const booking = new Booking.create({
            user : req.user.id,
            event : eventId,
            quantity,
            status: "PENDING"
        })

        res.status(201).json({
            message:"Booking Created",
            booking,
        })

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = createBooking;