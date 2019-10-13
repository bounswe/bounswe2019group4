const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile')
const {modelBinder} = require('../controllers/db')
const { User } = require('../models/user')
/*
  Get endpoint for profile page.
  Check controller function for more detail
*/
router.get('/:id', modelBinder(User, 'User'), profileController.getDetails)

module.exports = router
