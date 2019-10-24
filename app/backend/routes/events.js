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

/*
  Get endpoint for specific event page.
  Check controller function for more detail
*/
router.get('/:id', modelBinder(Event, 'Event'), eventController.getEvent)

module.exports = router
