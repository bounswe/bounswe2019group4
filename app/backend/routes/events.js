const express = require('express');
const router = express.Router();
const eventController = require('../controllers/events')
const {modelBinder} = require('../controllers/db')
const { Event } = require('../models/event')
/*
  Get endpoint for events page.
  Check controller function for more detail
*/
router.get('/', modelBinder(Event, 'Event'), eventController.getEvents)

module.exports = router
