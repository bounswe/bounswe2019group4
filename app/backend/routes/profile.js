const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile')

/*
  Post endpoint for profile page.
  Check controller function for more detail
*/
router.get('/:id', profileController.getDetails)

module.exports = router