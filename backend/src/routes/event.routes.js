const express = require('express');
const { getEvents, getEventById, createEvent } = require('../controllers/event.controller');
const { authorizeRoles } = require('../middleware/role.middleware');
const protect = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/',getEvents);
router.get('/:id',getEventById);

//protected + role-based
router.post('/',protect,authorizeRoles("ORGANISER"),createEvent);

module.exports = router;