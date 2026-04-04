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

async function getEvents(req,res){
    try {
        const events = await Event.find().populate("organiser","email role");
        res.json(events);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

async function getEventById(req,res){
    try {
        const event = await Event.findById(req.params.id).populate("organiser","email role");
        if(!event) return res.status(404).json({message:"Event not found"})
        res.json(event);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports = {getEvents,getEventById,createEvent}