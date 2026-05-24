const express = require('express');
const { getEvents, getEventById, createEvent } = require('../controllers/event.controller');
const { authorizeRoles } = require('../middleware/role.middleware');
const protect = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createEventSchema } = require('../validators/schemas');

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);

// protected + role-based + validated
router.post('/', protect, authorizeRoles("ORGANIZER"), validate(createEventSchema), createEvent);

module.exports = router;