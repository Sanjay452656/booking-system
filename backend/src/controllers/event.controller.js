const Event = require('../models/event.model.js')

async function createEvent(req,res){
    try {
        const {title,description,date,price,totalSeats} = req.body;

        if(!title || !description || !date || !price || !totalSeats){
            return res.status(400).json({
                message:"Missing Required Fields"
            })
        }

        const event = await Event.create({
            title,
            description,
            date,
            price,
            totalSeats,
            availableSeats: totalSeats,
            organiser: req.user.id
        })

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

