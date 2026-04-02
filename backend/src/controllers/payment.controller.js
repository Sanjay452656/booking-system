const Booking = require("../models/booking.model");
const razorpay = require("../config/razorpay.js")
const crypto = require('crypto');


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
            amount : amount*100,
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

async function verifyPayment(req,res){
    try {
        
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature,bookingId} = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
           .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
           .update(body)
           .digest("hex")
        
        if(expectedSignature !=razorpay_signature){
            return res.status(400).json({message: "Invalid Payment"});
        }

        const booking = await Booking.findById(bookingId);

        if(!booking){
            return res.status(404).json({message:"Booking not found"});
        }

        if(booking.status == "PENDING"){
            return res.status(400).json({message:"Already Processed"})
        }

        booking.status = "CONFIRMED";
        await booking.save();

        res.json({
        message: "Payment successful, booking confirmed",
        booking,
    });
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
}