const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification')
const {modelBinder, multipleModelBinder} = require('../controllers/db')
const {isAuthenticated} = require('../controllers/auth')
const { Notification } = require('../models/notification')

/*
  Get endpoint for notification.
  Check controller function for more detail
*/
router.get('/', [
  isAuthenticated,
  modelBinder(Notification, 'Notification')
], notificationController.getNotifications)

/*
  Post endpoint for notification.
  Check controller function for more detail
*/
router.post('/', [
  isAuthenticated,
  modelBinder(Notification, 'Notification')
], notificationController.postNotifications)

module.exports = router
