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

module.exports = createBooking;