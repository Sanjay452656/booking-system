const razorpay = require("../config/razorpay");
const Booking = require("../models/booking.model");


async function createOrder(){
    try {
        const {bookingId} = req.body;

        const booking = await Booking.findById(bookingId).populate("event");

        if(!booking){
            return res.status(404).json({message : "Booking not Found"})
        }

        if(booking.status !== 'PENDING'){
            return res.status(400).json({message: "Invalid Booking state"})
        }

        const amount = booking.event.price * booking.quantity;

        const options = {
            amount : amount,
            currency : "INR",
            receipt : `receipt_${booking._id}`
        }

        const order = await razorpay.orders.create(options);

      res.json({
       orderId: order.id,
       amount: order.amount,
       currency: order.currency,
      });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}