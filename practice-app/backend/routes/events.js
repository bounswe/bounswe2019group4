const express = require('express');
const router = express.Router();
const eventsControllers = require('../controllers/events')

// Retrieve events list endpoint. Check controller function for more detail
router.get("/list", eventsControllers.list);

module.exports = router;
