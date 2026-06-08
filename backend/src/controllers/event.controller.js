const Event = require('../models/event.model.js')

async function createEvent(req,res){
    try {
        const {title, description, date, price, totalSeats, category, location} = req.body;

        const event = await Event.create({
            title, description, date, price,
            totalSeats,
            availableSeats: totalSeats,
            category: category || 'Other',
            location: location || '',
            organiser: req.user.id
        })

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

async function getEvents(req,res){
    try {
        const events = await Event.find()
            .populate("organiser","name email role")
            .sort({ date: 1 }); // soonest events first
        res.json(events);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

async function getEventById(req,res){
    try {
        const event = await Event.findById(req.params.id).populate("organiser","name email role");
        if(!event) return res.status(404).json({message:"Event not found"})
        res.json(event);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// GET /api/events/my — organizer's own events
async function getMyEvents(req, res) {
    try {
        const events = await Event.find({ organiser: req.user.id })
            .sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// PUT /api/events/:id — update event (organizer only, ownership enforced)
async function updateEvent(req, res) {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.organiser.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You can only edit your own events' });
        }

        const { title, description, date, price, category, location } = req.body;

        // Only allow editing fields that don't affect seat inventory
        // totalSeats is intentionally excluded to prevent integrity issues
        if (title)       event.title       = title;
        if (description !== undefined) event.description = description;
        if (date)        event.date        = date;
        if (price !== undefined) event.price = Number(price);
        if (category)    event.category    = category;
        if (location !== undefined) event.location = location;

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// DELETE /api/events/:id — delete event (organizer only, ownership enforced)
async function deleteEvent(req, res) {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.organiser.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own events' });
        }

        await event.deleteOne();
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getEvents, getEventById, createEvent, getMyEvents, updateEvent, deleteEvent };