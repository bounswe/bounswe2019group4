const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile')

/*
  Get endpoint for profile page.
  Check controller function for more detail
*/
router.get('/:id', profileController.getDetails)

module.exports = router
